import * as React from 'react';
import axios from "axios"
import moment from "moment"

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

export default class AppMainBody extends React.Component {

    constructor(props) {
        super(props);
        this.windowDimensions = getWindowDimensions();
        this.state = {
            rows: [],
            showType: "",
            searchText: "",
            searchActive: false,
            rowsToShow: [],
            sortDescending: true,
            fetchingMore: false
        }
    }

    componentDidMount() {
        let temp_results = []
        let temp_ids = [];

        for (let x = 1; x < 5; x++) {
            axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${x}&sparkline=false`)
                .then((response) => {
                    response.data.map((r, i) => {

                        r['percentage_to_ath'] = (((r.ath - r.current_price) / r.current_price) * 100).toFixed(2)
                        if (!temp_ids.includes(r.id)) {
                            temp_ids.push(r.id)
                            temp_results[r.market_cap_rank - 1] = r;
                        }

                        if (x === 4) {
                            setTimeout(() => this.setState({ ...this.state, rows: temp_results, rowsToShow: temp_results.slice(0, 250), lastIndex: 250 }), 200)
                        }
                    }
                    )
                }
                )
        }
    }

    searchCoins(searchText) {
        let results_list = []
        let ids = []
        let searchTextName = searchText.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        this.state.rows.filter(coin => coin.name.includes(searchTextName) || coin.symbol.includes(searchText.toLowerCase())).map(coins => {
            if (!ids.includes(coins.id)) {
                ids.push(coins.id);
                results_list.push(coins)
            }
        })
        this.setState({ ...this.state, rowsToShow: results_list })

    }
    numberWithCommas(x) {
        return x.toLocaleString("en-UK");
    }

    sortResults(sortType) {
        let sorted = ""
        if (this.state.sortDescending) {
            sorted = this.state.rowsToShow.sort((a, b) => a[sortType] - b[sortType]);
        } else {
            sorted = this.state.rowsToShow.sort((a, b) => b[sortType] - a[sortType]);
        }

        this.setState({ ...this.state, rowsToShow: sorted, sortDescending: !this.state.sortDescending })
    }

    loadMore(e) {

        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom && this.state.rowsToShow.length < 1000) {
            this.setState({ ...this.state, fetchingMore: true })
            let new_rows = this.state.rows.slice(this.state.lastIndex, this.state.lastIndex + 750);
            let allRows = [...this.state.rowsToShow]
            new_rows.map((row) =>
                allRows.push(row)
            )
            this.setState({ ...this.state, rowsToShow: allRows, lastIndex: this.state.lastIndex + 750, fetchingMore: false })
        }
    }

    render() {
        return (
            <>
                {this.windowDimensions.width <= 800 ?
                    <div>
                        <input type="text" placeholder="Search for a coin. e.g. BTC, Bitcoin" style={{ width: "100%", margin: "0", height: "40px", border: "none", borderBottom: "1px solid #ddd", textIndent: 15, fontSize: "14px" }}
                            onChange={(e) => { this.setState({ ...this.state, searchText: e.target.value }); this.searchCoins(e.target.value) }} className={"search-input"} />
                    </div>
                    : <input type="text" style={{
                        height: "40px",
                        width: "300px",
                        position: "absolute",
                        top: "5px",
                        left: "50%",
                        border: "none",
                        textIndent: "20px",
                        borderBottom: "1px solid #eee",
                        background: "transparent",
                        color: "#FFF",
                        transform: "translate(-50%, 0)",

                    }}
                        className={"header-input"}

                        placeholder="Search for a coin. e.g. BTC, Bitcoin"
                        onChange={(e) => { this.setState({ ...this.state, searchText: e.target.value }); this.searchCoins(e.target.value) }} />}


                <div style={{
                    height: this.windowDimensions.width > 800 ? "calc(100vh - 55px)" : "calc(100vh - 0)",
                    paddingBottom: 55,
                    marginTop: this.windowDimensions.width > 800 ? 0 : 0,
                }}

                >
                    <section style={{ width: "100%", backgroundColor: '#eee', height: 45, display: "flex", textAlign: "right", fontWeight: 600, lineHeight: "45px", paddingRight: 15, borderBottom: "1px solid #ddd" }}>
                        <div style={{ flex: this.windowDimensions.width > 800 ? 0.4 : 0.6, textAlign: "center", cursor: "pointer" }} onClick={() => { this.sortResults("market_cap_rank") }}>
                            #
                        </div>
                        <div style={{ flex: this.windowDimensions.width > 800 ? 1 : 1, textAlign: "left", cursor: "pointer" }} onClick={() => this.sortResults("symbol")}>
                            Coin
                        </div>

                        {this.windowDimensions.width > 800 ?
                            <>
                                <div style={{ flex: 1, cursor: "pointer" }} onClick={() => this.sortResults("atl")}>
                                    ATL Price
                                </div>
                                <div style={{ flex: 1, cursor: "pointer" }} onClick={() => this.sortResults("ath")}>
                                    ATH Price
                                </div>
                                <div style={{ flex: 1.5, cursor: "pointer" }} onClick={() => this.sortResults("ath_date")}>
                                    ATH Date
                                </div>
                                <div style={{ flex: 1.5, cursor: "pointer" }}>
                                    ATL Date
                                </div>

                            </>
                            : ""
                        }


                        <div style={{ flex: 1, textAlign: "right", paddingRight: 15, cursor: "pointer" }} onClick={() => this.sortResults("percentage_to_ath")}>
                            % to ATH
                        </div>



                        <div style={{ flex: 1, textAlign: "right", paddingRight: 15, cursor: "pointer" }} onClick={() => this.sortResults("atl_change_percentage")}>
                            % from ATL
                        </div>

                    </section >

                    <section style={{
                        height: this.windowDimensions.width > 800 ? "calc(100vh - 110px)" : "calc(100vh - 145px)",
                        marginTop: this.windowDimensions.width > 800 ? 0 : 0,
                        paddingBottom: 55,
                        overflowY: "auto",


                    }} onScroll={(e) => this.loadMore(e)}>



                        {this.state.rowsToShow.length > 0 ? this.state.rowsToShow.map((row, i) =>



                            <>
                                <section className="row" style={{ display: "flex", lineHeight: "45px", height: 45, borderBottom: "1px solid #eee", lineHeight: "45px", paddingRight: 15, background: '#FFF', textAlign: "right" }}>
                                    <div style={{ flex: this.windowDimensions.width > 800 ? 0.4 : 0.4, textAlign: "center" }}>
                                        {row.market_cap_rank}
                                    </div>
                                    <div style={{ flex: this.windowDimensions.width > 800 ? 0.2 : 0.4 }}>
                                        <img src={row.image} style={{ width: 25, height: 25, marginTop: 10, marginRight: 5 }} />
                                    </div>
                                    <div style={{ flex: 0.8, textAlign: "left", display: "table-cell", verticalAlign: "middle", paddingLeft: 5, textTransform: "uppercase" }}>
                                        {row.symbol}
                                    </div>

                                    {this.windowDimensions.width > 800 ?
                                        <>
                                            <div style={{ flex: 1 }}>
                                                $ {row.atl}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                $ {this.numberWithCommas(row.ath)}
                                            </div>
                                            <div style={{ flex: 1.5 }}>
                                                {moment(row.ath_date).format('MMMM Do YYYY')}
                                            </div>
                                            <div style={{ flex: 1.5 }}>
                                                {moment(row.atl_date).format('MMMM Do YYYY')}
                                            </div>
                                        </>
                                        : ""
                                    }

                                    <div style={{ flex: 1, textAlign: this.windowDimensions.width > 800 ? "right" : "center", color: row.ath > 0.00 ? "#10ac84" : "darkorange" }}>
                                        {this.numberWithCommas(row.percentage_to_ath)}%
                                    </div>
                                    <div style={{ flex: 1, textAlign: "right" }}>
                                        {this.numberWithCommas(row.atl_change_percentage.toFixed(2))}%
                                    </div>
                                    {this.state.fetchingMore ? <section className="loader">
                                    </section> : ""}

                                </section>


                            </>

                        )
                            :
                            <section className="loader">
                            </section>
                        }

                    </section>

                </div>
            </>
        );
    }
}