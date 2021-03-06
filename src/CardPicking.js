import React from 'react'
import PropTypes from 'prop-types'
import dealer from './dealer.png';
import arrow from './arrow.svg';
import ReactDice from 'react-dice-complete'
import { useState } from 'react';


function Cardpicking(props) {
    const [firstRoll, setFirstRoll] = useState(null);
    const [secondRoll, setSecondRoll] = useState(null);
    const [dragonRoll, setDragonRoll] = useState(null);
    const [direction, setDirection] = useState(0);  // 0,1,2,3
    const [pickcardStartPoint, setPickcardStartPoint] = useState(null);
    const [buttonShow, setButtonShow] = useState(true);

    let diceRef = {};

    function rollDoneCallback(num) {
        if (!firstRoll) {
            // if it's the first roll
            setFirstRoll(num);
            const nextDirection = (num - 1) % 4;
            setDirection(nextDirection);  // Set direction for next player to roll
        } else if (!secondRoll) {
            // if it's the second roll
            setSecondRoll(num);
            const total = firstRoll + num;
            let pickDirection = total < 17 ? direction : direction - 1;
            pickDirection = (pickDirection + 4) % 4;
            setPickcardStartPoint({
                direction: pickDirection,
                fromRight: total < 17 ? total : total - 17
            });
            setDirection(2);  // Set direction for opposite player to roll dragon
        } else if (!dragonRoll) {
            setDragonRoll(num);
            let pickDirection = pickcardStartPoint.direction;
            let pickFromRight = pickcardStartPoint.fromRight;
            if (num <= pickFromRight) {
                setPickcardStartPoint({
                    direction: pickDirection,
                    fromRight: pickFromRight - num + 1,
                    fromLeft: num
                });
            } else {
                setPickcardStartPoint({
                    direction: (pickDirection + 1) % 4,
                    fromRight: 17 - (num - pickFromRight) + 1,
                    fromLeft: num - pickFromRight
                });
            }

            setDirection(0);  // Set direction for opposite player to roll dragon
        } else {
            // if it's after the second roll
            clearResult();
        }
    }

    function rollIt() {
        if (dragonRoll) {
            clearResult();
        } else {
            setButtonShow(false);
            setTimeout(() => setButtonShow(true), 500);
            diceRef.rollAll();
        }
    }

    function clearResult() {
        setFirstRoll(null);
        setSecondRoll(null);
        setDragonRoll(null);
        setPickcardStartPoint(null);
    }

    function getPhrase(d) {
        let result;
        if (!firstRoll) {
            result = d === 0 ? "请掷骰子" : null;
        } else if (!secondRoll) {
            result = <span>第一次：{firstRoll}</span>
        } else if (!dragonRoll && pickcardStartPoint) {
            let pickCardPhrase;
            if (d === 0) {
                let rightHandPhrase = "右侧";
                let leftHandPhrase = "左侧";
                switch (pickcardStartPoint.direction) {
                    case 1:
                        rightHandPhrase = "远端";
                        leftHandPhrase = "近端";
                        break;
                    case 2:
                        rightHandPhrase = "左侧";
                        leftHandPhrase = "右侧";
                        break;
                    case 3:
                        rightHandPhrase = "近端";
                        leftHandPhrase = "远端";
                        break;
                    default:
                        break;
                }
                if (pickcardStartPoint.fromRight <= 8) {
                    if (pickcardStartPoint.fromRight === 0) {
                        pickCardPhrase = `抓牌：从${rightHandPhrase}起抓`;
                    } else {
                        pickCardPhrase = `抓牌：从${rightHandPhrase}起留 ` + pickcardStartPoint.fromRight + " 张";
                    }
                } else {
                    pickCardPhrase = `抓牌：从${leftHandPhrase}起抓 ` + (17 - pickcardStartPoint.fromRight) + " 张";
                }
            }
            result = <span> {pickCardPhrase ? <span>{pickCardPhrase} <br /></span> : null}
        点数：{firstRoll} + {secondRoll} = <span style={{ fontSize: 60, textDecorationLine: 'underline', textDecorationThickness: 3, textUnderlineOffset: 7 }}>{firstRoll + secondRoll}</span>
            </span>
        } else if (pickcardStartPoint) {
            // 打混儿阶段
            let rightHandPhrase = "右侧";
            let leftHandPhrase = "左侧";
            switch ((pickcardStartPoint.direction - d + 4) % 4) {
                case 1:
                    rightHandPhrase = "远端";
                    leftHandPhrase = "近端";
                    break;
                case 2:
                    rightHandPhrase = "左侧";
                    leftHandPhrase = "右侧";
                    break;
                case 3:
                    rightHandPhrase = "近端";
                    leftHandPhrase = "远端";
                    break;
                default:
                    break;
            }
            if (pickcardStartPoint.fromRight < pickcardStartPoint.fromLeft) {
                result = `混儿：从${rightHandPhrase}起第 ${pickcardStartPoint.fromRight} 张`;
            } else if (pickcardStartPoint.fromRight > pickcardStartPoint.fromLeft) {
                result = `混儿：从${leftHandPhrase}起第 ${pickcardStartPoint.fromLeft} 张`;
            } else {
                result = `混儿：第 ${pickcardStartPoint.fromRight} 张`
            }
        }
        return result;
    }

    return (
        <div className="CardPicking">
            <ReactDice numDice={2}
                rollDone={rollDoneCallback}
                dieSize={80}
                faceColor="white"
                dotColor="midnightblue"
                rollTime={0.5}
                disableIndividual={true}
                defaultRoll={12}
                ref={dice => diceRef = dice}></ReactDice>
            <div>
                <button className="button"
                    onClick={rollIt}
                    style={{
                        position: 'absolute',
                        left: '50vw',
                        top: 'calc(50vh + 80px)',
                        visibility: buttonShow ? 'unset' : 'hidden',
                        transform: `translate(-50%, -50%) rotate(${-direction * 90}deg)`
                    }}>{!secondRoll ? "掷骰子" : !dragonRoll ? "打混儿" : "再来一局"}</button>
            </div>
            <div></div>
            <div id="p0" className="result">{getPhrase(0)}</div>
            <div id="p1" className="result">{getPhrase(1)}</div>
            <div id="p2" className="result">{getPhrase(2)}</div>
            <div id="p3" className="result">{getPhrase(3)}</div>
            <div><img src={dealer} id="dealer" alt="dealer" draggable="false" /></div>
            <div><img src={arrow} id="arrow" alt="arrow" draggable="false"
                className={`direction-${pickcardStartPoint?.direction}`}
                style={{ visibility: pickcardStartPoint ? 'unset' : 'hidden' }} /></div>
        </div>
    );
}

Cardpicking.propTypes = {

}

export default Cardpicking
