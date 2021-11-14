import { TextField } from '@material-ui/core'
import React, { useState } from 'react'

const AppHeader = (data) => {

    const [searchText, setSearchText] = useState("")

    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }

    const windowDimensions = getWindowDimensions();
    return (
        <section className="app-header">
            <section>
                <h2 className="app-logo">{data.data.name}</h2>
                {/* 
                {windowDimensions.width >= 800 ?
                    <input type="text" style={{
                        height: "40px",
                        width: "50%",
                        position: "absolute",
                        top: "5px",
                        right: "20px",
                        border: "none",
                        textIndent: "20px",
                        borderBottom: "1px solid #ccc",
                        background: "transparent",
                        color: "#FFF"
                    }}
                        className={"header-input"}
                        value={searchText}
                        placeholder="Search for a coin. e.g. BTC, Bitcoin"
                        onChange={(e) => setSearchText(e.target.value)}
                    /> : ""} */}
            </section>
        </section>
    )
}

export default AppHeader
