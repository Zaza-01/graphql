"use client";

import { useQuery, gql } from '@apollo/client';
import client from '../../lib/apolloClient';
import React from 'react';
import { AuditRatioBarChart } from '@/components/AuditRatioChart';
import BarChart from '@/components/BarChart';
import { XPLineChart } from '@/components/XPLineChart';

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


interface Game {
  level: number;
  result: {
    name: string;
  };
  attempts: number;
}

export default function Profile() {
  const { loading, error, data } = useQuery(USER_QUERY, { client });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { user, event_user, toad_session_game_results } = data;

  let userLevel = event_user.filter((eventUser: any) => eventUser.userId === user[0].groupsByCaptainid[0].captainId);

  const memoryGameResults = toad_session_game_results.filter((game: Game) => game.result.name === 'memory');
  const zzleGameResults = toad_session_game_results.filter((game: Game) => game.result.name === 'zzle');

  // Find the highest level in the memory game
  const highestMemoryLevel = memoryGameResults.reduce((max: Game, game: Game) =>
    game.level > max.level ? game : max
    , memoryGameResults[0]);

  const highestMemoryAttemps = memoryGameResults.reduce((max: Game, game: Game) =>
    game.attempts > max.attempts ? game : max
    , memoryGameResults[0]);

  const highestZzleAttemps = zzleGameResults.reduce((max: Game, game: Game) =>
    game.attempts > max.attempts ? game : max
    , zzleGameResults[0]);

  const highestZzleLevel = zzleGameResults.reduce((max: Game, game: Game) =>
    game.level > max.level ? game : max
    , zzleGameResults[0]);


  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  }


  return (
    <div className='flex flex-col justify-center items-center h-[100vh] w-100vw'>
        <button className='bg-black w-[6em] h-[3em] absolute top-0 right-0 mr-[1em] mt-[1em] flex justify-center items-center rounded-md hover:bg-slate-500 transition-all ease-in duration-0.3ms cursor-pointer' onClick={logout}>
          <span className='font-title font-medium text-white'>Logout</span>
        </button>
      <div className='profile-grid relative'>
        <div className='user-info'>
          <h1 className='font-title mb-4 title' style={{ fontSize: '2.2em' }}>Welcome, {user[0].firstName} {user[0].lastName} 🏋🏽</h1>
          <h1 className='font-title' style={{ fontSize: '1.2em' }}>&emsp;Your Email : <span className='font-text2 font-medium'>{user[0].email}</span></h1>
          <p className='font-title' style={{ fontSize: '1.2em' }}>&emsp;Your Username : <span className='font-text2 font-medium'>{user[0].login}</span></p>
          <p className='font-title' style={{ fontSize: '1.2em' }}>&emsp;Your Level : <span className='font-text2 font-medium'>{userLevel[0].level}</span></p>
        </div>
        <div className='audit-ratio'>
          <h2 className='font-title title' style={{ fontSize: '1.8em' }}>Audit Ratio</h2>
          <AuditRatioBarChart data={user[0]} />
        </div>
        <div className='bar-chart'>
          <h2 className='font-title title' style={{ fontSize: '1.8em' }}>Distribution By Level</h2>
          <BarChart data={event_user} userEventId={user[0].groupsByCaptainid[user[0].groupsByCaptainid.length - 1].eventId} />
        </div>
        <div className='xp-line-chart'>
          <h2 className='mb-3 font-title title' style={{ fontSize: '1.8em' }}>XP Progression</h2>
          <XPLineChart data={user[0].TransactionsFiltered1} />
        </div>
        <div className="test-game-result font-text2 font-medium">
          <h2 className='font-title title' style={{ fontSize: '1.8em' }}>Toad Game Results</h2>
          <div className="game-result">
            <div className="memoryGame">
              <h3 className='font-title' style={{ fontSize: '1.3em' }}>Memory Game</h3>
              <p>&emsp;Highest Level: {highestMemoryLevel.level}</p>
              <h3>&emsp;Highest Attempts:</h3>
              <p>&emsp;Level: {highestMemoryAttemps.level} | Attempts: {highestMemoryAttemps.attempts}</p>
            </div>
            <div className="zzleGame">
              <h3 className='font-title' style={{ fontSize: '1.3em' }}>Zzle Game:</h3>
              <p>&emsp;Highest Level: {highestZzleLevel.level}</p>
              <h3>&emsp;Highest Attempts:</h3>
              <p>&emsp;Level: {highestZzleAttemps.level} | Attempts: {highestZzleAttemps.attempts}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
