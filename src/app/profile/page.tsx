"use client";

import { useQuery, gql } from '@apollo/client';
import client from '../../lib/apolloClient';
import { AuditRatioBarChart } from '@/components/AuditRatioChart';
import BarChart from '@/components/BarChart';
import { XPLineChart } from '@/components/XPLineChart';
import { Error } from '@/components/Error';
import { Loading } from '@/components/Loading';
import { ToadGame } from '@/components/ToadGame';

const USER_QUERY = gql`
  query User {
    user {
      auditRatio
      email
      firstName
      lastName
      login
      totalDown
      totalUp
      groupsByCaptainid {
        campus
        captainId
        captainLogin
        createdAt
        eventId
        id
        objectId
        path
        status
        updatedAt
      }
      TransactionsFiltered1: transactions(where: {type: {_eq: "xp"}, path: { _like: "%bh-module%", _nregex: "^.*(piscine-js/|piscine-rust/|piscine-ui/|piscine-ux/).*" }}) {
        amount
        type
        path
        createdAt
      }
    }
    event_user(where: { eventId: { _in: [72, 20, 250] } }) {
      level
      userId
      userLogin
      eventId
    }
    toad_session_game_results {
      level
      result {
        name
      }
      attempts
    }
  }
`;

type EventUser = {
  level: number;
  userId: string;
  userLogin: string;
  eventId: number;
};

export default function Profile() {
  const { loading, error, data } = useQuery(USER_QUERY, {
    client,
    fetchPolicy: 'no-cache',
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;

  const { user, event_user, toad_session_game_results } = data;

  const userLevel = event_user.filter((eventUser: EventUser) => eventUser.userId === user[0].groupsByCaptainid[0].captainId);


  const logout = () => {
    localStorage.removeItem('token');
    client.clearStore();
    window.location.href = '/';
  }


  return (
    <div className='profile-grid-container'>
      <div className='profile-grid'>
        <div className='user-info card'>
          <div className='welcome-logout flex justify-between gap-7 items-center'>
            <h1 className='font-title title'>Welcome, {user[0].firstName} {user[0].lastName} 🏋🏽</h1>
            <svg onClick={logout} className='logoutIcon' viewBox="-2.4 -2.4 28.80 28.80" fill="black" xmlns="http://www.w3.org/2000/svg" stroke="black"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.048"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M15.9998 2L14.9998 2C12.1714 2 10.7576 2.00023 9.87891 2.87891C9.00023 3.75759 9.00023 5.1718 9.00023 8.00023L9.00023 16.0002C9.00023 18.8287 9.00023 20.2429 9.87891 21.1215C10.7574 22 12.1706 22 14.9976 22L14.9998 22L15.9998 22C18.8282 22 20.2424 22 21.1211 21.1213C21.9998 20.2426 21.9998 18.8284 21.9998 16L21.9998 8L21.9998 7.99998C21.9998 5.17157 21.9998 3.75736 21.1211 2.87868C20.2424 2 18.8282 2 15.9998 2Z" fill="black"></path> <path fillRule="evenodd" clipRule="evenodd" d="M15.75 12C15.75 11.5858 15.4142 11.25 15 11.25L4.02744 11.25L5.98809 9.56943C6.30259 9.29986 6.33901 8.82639 6.06944 8.51189C5.79988 8.1974 5.3264 8.16098 5.01191 8.43054L1.51191 11.4305C1.34567 11.573 1.25 11.781 1.25 12C1.25 12.2189 1.34567 12.4269 1.51191 12.5694L5.01191 15.5694C5.3264 15.839 5.79988 15.8026 6.06944 15.4881C6.33901 15.1736 6.30259 14.7001 5.98809 14.4305L4.02744 12.75L15 12.75C15.4142 12.75 15.75 12.4142 15.75 12Z" fill="black"></path> </g></svg>
          </div>
          <div className="info">
            <p className='font-title'>&emsp;Your Email : <span className='font-text2 font-medium'>{user[0].email}</span></p>
            <p className='font-title'>&emsp;Your Username : <span className='font-text2 font-medium'>{user[0].login}</span></p>
            <p className='font-title'>&emsp;Your Level : <span className='font-text2 font-medium'>{userLevel[0].level}</span></p>
          </div>
        </div>
        <div className='audit-ratio card'>
          <h2 className='font-title title'>Audit Ratio</h2>
          <AuditRatioBarChart data={user[0]} />
        </div>
        <div className='bar-chart card'>
          <h2 className='font-title title'>Distribution By Level</h2>
          <BarChart data={event_user} userEventId={user[0].groupsByCaptainid[user[0].groupsByCaptainid.length - 1].eventId} />
        </div>
        <div className='xp-line-chart card'>
          <h2 className='mb-3 font-title title'>XP Progression</h2>
          <XPLineChart data={user[0].TransactionsFiltered1} />
        </div>
        <ToadGame toad_session_game_results={toad_session_game_results} />
      </div>
    </div>
  );
}
