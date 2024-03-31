import React from 'react';

const Loading = props => {
    return(<>
        {
            props.start === true &&
            <div id="overlay">
                <div className="shapeshifter play" style={ { backgroundImage: `url(${'/image/loading4.gif'})` } } ></div>
            </div>
        }
    </>)
}

export default Loading
