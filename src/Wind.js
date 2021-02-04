import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ReactDice from 'react-dice-complete'
import _ from 'lodash'

function Wind(props) {
    const [rollCount, setRollCount] = useState(0);
    const [buttonShow, setButtonShow] = useState(true);
    const [diceRef, setDiceRef] = useState(null);
    const [results, setResults] = useState([]);
    const [largestIndex, setLargestIndex] = useState(-1);
    const [rollRound, setRollRound] = useState(4);

    function rollDoneCallback(num) {
        let newResults;
        setResults((prev) => {
            newResults = [...prev, num];
            return newResults
        });
        if (rollCount === rollRound) {
            // Log largest roll number
            const maxCount = _.countBy(newResults)[_.max(newResults)];
            if (maxCount === 1) {
                const index = _.findIndex(newResults, (result) => result === _.max(newResults));
                setLargestIndex(index);
            }
        }
    }

    function rollIt() {
        if (rollCount === rollRound) {
            const maxCount = _.countBy(results)[_.max(results)];
            if (maxCount === 1) {
                window.location.replace('/pick');
            } else {
                setLargestIndex(-1);
                setRollCount(0);
                setResults([]);
                setRollRound(maxCount);
            }
        } else {
            setButtonShow(false);
            setTimeout(() => setButtonShow(true), 500);
            diceRef?.rollAll();
            setRollCount((prev) => prev + 1);
        }
    }

    return (
        <div className="Wind">
            <ReactDice
                numDice={2}
                rollDone={rollDoneCallback}
                dieSize={80}
                faceColor="white"
                dotColor="red"
                rollTime={0.5}
                disableIndividual={true}
                defaultRoll={12}
                ref={dice => setDiceRef(dice)}></ReactDice>
            <button className="button"
                onClick={rollIt}
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    visibility: buttonShow ? 'unset' : 'hidden',
                    transform: `translate(-50%, -50%)`
                }}>{largestIndex === -1 ? rollCount === rollRound ? "决斗" : "掷骰子" : "开门儿"}</button>
            <table>
                <thead>
                    <tr>
                        <th>序号</th>
                        <th>大小</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((result, index) =>
                        <tr key={index} style={index === largestIndex ? { backgroundColor: 'lightgreen' } : null}>
                            <td>{index + 1}</td>
                            <td>{result}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

Wind.propTypes = {

}

export default Wind
