'use client';

interface Game {
    level: number;
    result: {
        name: string;
    };
    attempts: number;
}

interface ToadResultProps {
    toad_session_game_results: Game[];
}

export const ToadGame: React.FC<ToadResultProps> = ({ toad_session_game_results }) => {

    const memoryGameResults = toad_session_game_results.filter((game: Game) => game.result.name === 'memory');
    const zzleGameResults = toad_session_game_results.filter((game: Game) => game.result.name === 'zzle');
    // Find the highest level in the memory game
    const highestMemoryLevel = memoryGameResults.reduce((max: Game, game: Game) =>
        game.level > max.level ? game : max
        , memoryGameResults[0]);

    const highestMemoryAttemps = memoryGameResults.reduce((max: Game, game: Game) =>
        game.attempts > max.attempts ? game : max
        , memoryGameResults[0]);

    console.log(highestMemoryAttemps.attempts);
    

    const highestZzleAttemps = zzleGameResults.reduce((max: Game, game: Game) =>
        game.attempts > max.attempts ? game : max
        , zzleGameResults[0]);

    const highestZzleLevel = zzleGameResults.reduce((max: Game, game: Game) =>
        game.level > max.level ? game : max
        , zzleGameResults[0]);

    return (
        <div className="test-game-result font-text2 relative card">
            <h1 className='font-title title absolute top-[20px]'>Toad Game Results</h1>
            <div className="game-result">
                <div className="memoryGame">
                    <h2 className='font-title toad-subtitle'>Memory Game</h2>
                    <p>&emsp;Highest Level: {highestMemoryLevel.level}</p>
                    <p>&emsp;Highest Attempts:</p>
                    <p>&emsp;&emsp;Level: {highestMemoryAttemps.level} | Attempts: {highestMemoryAttemps.attempts}</p>
                </div>
                <div className="zzleGame">
                    <h2 className='font-title toad-subtitle'>Zzle Game:</h2>
                    <p>&emsp;Highest Level: {highestZzleLevel.level}</p>
                    <p>&emsp;Highest Attempts:</p>
                    <p>&emsp;&emsp;Level: {highestZzleAttemps.level} | Attempts: {highestZzleAttemps.attempts}</p>
                </div>
            </div>
        </div>
    )
}