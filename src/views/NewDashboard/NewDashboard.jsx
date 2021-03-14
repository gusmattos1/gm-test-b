import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import queryString from "query-string";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import { getApiToken, getApiURL, getSocketURL } from "src/utils";
import { INTERVAL_OPTIONS, RESOLUTION } from "./constants";
import Selector from "../../components/Selector";
import { getUnixTime, transformData, transformliveData } from "./utils";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const API_TOKEN = getApiToken();
const API_URL = getApiURL();
const SOCKET_URL = getSocketURL();

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    marginTop: theme.spacing(3),
    display: "flex",
    justifyContent: "center"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  graphContainer: {
    maxWidth: 1000,
    margin: "auto",
    padding: 20
  },
  selectorContainer: {
    margin: "auto",
    marginTop: theme.spacing(3),
    display: "flex",
    justifyContent: "center",
    flexDirection: "column"
  },
  box: {
    width: "100%",
    display: "flex",
    justifyContent: "center"
  }
}));

const NewDashboard = () => {
  const [socket, setSocket] = useState();
  const [allSymbols, setAllSymbols] = useState([]);
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [prevSelectedSymbols, setPrevSelectedSymbols] = useState([]);
  const [graphs, setGraphs] = useState();
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [interval, setInterval] = useState(INTERVAL_OPTIONS[0]);
  const liveDataRef = useRef();
  const selectedSymbolsRef = useRef();
  const classes = useStyles();

  selectedSymbolsRef.current = selectedSymbols;

  const to = useMemo(() => {
    return getUnixTime(new Date());
  }, []);

  const from = useMemo(() => {
    let d = new Date();
    d.setDate(d.getDate() - interval);

    return getUnixTime(d);
  }, [interval]);

  const getSymbolData = async (symbol) => {
    const query = {
      token: API_TOKEN,
      resolution: RESOLUTION,
      from,
      to,
      symbol
    };

    try {
      const response = await fetch(
        `${API_URL}/candle?${queryString.stringify(query)}`
      );
      const data = await response.json();
      if (data.s && data.s === "no_data") {
        return { error: "No Data Available", symbol: symbol };
      }
      const transformedData = transformData(data, symbol);
      return transformedData;
    } catch (error) {
      console.error("Error getting symbol data");
    }
  };

  useEffect(() => {
    const getAllSymbols = async () => {
      try {
        const response = await fetch(
          `${API_URL}/symbol?exchange=US&token=${API_TOKEN}`
        );
        const symbols = await response.json();
        const sortedSymbols = symbols
          .map((item) => item.displaySymbol)
          .sort((a, b) => a > b);
        setAllSymbols(sortedSymbols);
      } catch (error) {
        console.error("Error getting all symbols");
      }
      setLoading(false);
    };

    getAllSymbols();
  }, []);

  useEffect(() => {
    if (!from || !to) {
      return;
    }

    if (live) {
      setLiveConnection();
    } else {
      fetchSymbolsData();
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, selectedSymbols, live]);

  /**
   * Update the socket subscription removing and adding symbols
   * @param {*} socket - the socket instance
   */
  const updateSocketSymbols = (socket) => {
    const toRemove = prevSelectedSymbols.filter(
      (x) => !selectedSymbols.includes(x)
    );
    // removes old symbols
    toRemove.forEach((symbol) => {
      socket.send(JSON.stringify({ type: "unsubscribe", symbol }));
    });
    // Includes new symbols
    selectedSymbols.forEach((symbol) => {
      socket.send(JSON.stringify({ type: "subscribe", symbol }));
    });

    setPrevSelectedSymbols(selectedSymbols);
  };

  /**
   * Creates or updates the socket subscription removing and adding symbols
   */
  const setLiveConnection = () => {
    let newSocket = socket;
    if (!newSocket || newSocket.readyState !== 1) {
      const socket = new WebSocket(`${SOCKET_URL}?token=${API_TOKEN}`);
      setSocket(socket);

      socket.addEventListener("open", function (event) {
        updateSocketSymbols(socket);
      });

      socket.addEventListener("message", function (event) {
        createLiveDataChart(event.data);
        // console.log("Message from server ", event.data);
      });
    } else {
      updateSocketSymbols(socket);
    }
  };

  /**
   * Parse and creates a new chat based on the live data
   * @param {*} data - data from socket message
   */
  const createLiveDataChart = (data) => {
    const { data: parsedData } = JSON.parse(data);
    const transformedData = transformliveData(
      parsedData,
      liveDataRef.current,
      selectedSymbolsRef.current
    );
    liveDataRef.current = transformedData;
    renderGraphs(transformedData);
  };

  /**
   * Fetch data for all symbols inside 'selectedSymbols'
   */
  const fetchSymbolsData = async () => {
    const promises = [];

    selectedSymbols.forEach(async (symbol) => {
      promises.push(getSymbolData(symbol));
    });
    const response = await Promise.all(promises);

    renderGraphs(response);

    return response;
  };

  /**
   * Creates one or more charts based on formated data
   * @param {Array} dataSet - data from socket message
   */
  const renderGraphs = (dataSet) => {
    console.log("response", dataSet);

    const graphs = dataSet.map((data, index) => {
      if (data.error) {
        return (
          <div key={index} className={classes.graphContainer}>
            <Typography variant="h5" align="center">
              {data.symbol}
            </Typography>
            <Typography align="center">{data.error}</Typography>
          </div>
        );
      }

      return (
        <div key={data.symbol || index} className={classes.graphContainer}>
          <Typography variant="h5" align="center">
            {data.symbol}
          </Typography>
          <Line
            data={data}
            redraw={true}
            options={{
              fontSize: 12,
              elements: {
                // line: {
                //   tension: 0 // disables bezier curves
                // }
              },
              legend: {
                fontSize: 12,
                display: true,
                labels: {
                  fontColor: "rgb(255, 99, 132)"
                }
              },
              animation: {
                duration: 0 // general animation time
              },
              hover: {
                animationDuration: 0 // duration of animations when hovering an item
              },
              responsiveAnimationDuration: 0 // animation duration after a resize
            }}
          />
        </div>
      );
    });

    setGraphs(graphs);
  };

  /**
   * toggles the option for live data
   */
  const toggleLiveData = () => {
    if (live) {
      socket.close();
    }
    setGraphs(null);
    setLive(!live);
  };

  const handleChangeInterval = (event) => setInterval(event.target.value);

  if (loading)
    return (
      <div className={classes.root} data-testid="profile-spinner">
        <CircularProgress />
      </div>
    );

  return (
    <div>
      <div className={classes.selectorContainer}>
        <div className={classes.box}>
          <Selector
            options={allSymbols}
            setSelectedSymbols={setSelectedSymbols}
          />
        </div>

        <div className={classes.box}>
          <FormControlLabel
            control={
              <Checkbox
                checked={live}
                onChange={toggleLiveData}
                name="checkedB"
                color="primary"
              />
            }
            label="Live Data"
          />
          {!live && (
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Interval</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={interval}
                onChange={handleChangeInterval}
              >
                {INTERVAL_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>
                    Past {s} days
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </div>
      </div>

      <div className="container">{graphs}</div>
    </div>
  );
};

export default NewDashboard;
