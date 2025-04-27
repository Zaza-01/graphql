"use client";

import { useQuery, gql } from '@apollo/client';
import client from '../../lib/apolloClient';
import { AuditRatioBarChart } from '@/components/AuditRatioChart';
import React, { useState, useEffect } from 'react';
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

export default function Profile() {
  // const [showSkeleton, setShowSkeleton] = useState(true);
  const { loading, error, data } = useQuery(USER_QUERY, { client });

  // useEffect(() => {
  //   const timer = setTimeout(() => setShowSkeleton(false), 1000); // Minimum skeleton time: 1s
  //   return () => clearTimeout(timer);
  // }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;

  const { user, event_user, toad_session_game_results } = data;

  let userLevel = event_user.filter((eventUser: any) => eventUser.userId === user[0].groupsByCaptainid[0].captainId);


  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  }


  return (
    <div className='profile-grid-container'>
      {/* <button className='bg-black w-[6em] h-[3em] absolute top-0 right-0 mr-[1em] mt-[1em] flex justify-center items-center rounded-md hover:bg-slate-500 transition-all ease-in duration-0.3ms cursor-pointer' onClick={logout}>
          <span className='font-title font-medium text-white'>Logout</span>
        </button> */}
      <div className='profile-grid'>
        <div className='user-info card'>
          <h1 className='font-title title'>Welcome, {user[0].firstName} {user[0].lastName} 🏋🏽</h1>
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
