import React from 'react'
import PropTypes from 'prop-types'

function HomePage(props) {
    return <div className="HomePage">
        <h1>请选择阶段</h1>
        <button className="button" onClick={() => window.location.replace('/wind')}>打风头</button>
        <button className="button" onClick={() => window.location.replace('/pick')}>开门儿</button>
    </div>
}

HomePage.propTypes = {

}

export default HomePage
