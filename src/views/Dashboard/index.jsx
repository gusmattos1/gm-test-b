import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { getApiToken } from "src/utils";
import { STOCK_SYMBOLS } from "./constants";
import { transformliveData } from "./utils";

const API_TOKEN = getApiToken();

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 120,
    margin: theme.spacing(3)
  },
  graphContainer: {
    maxWidth: 1000,
    margin: "auto",
    padding: 20
  }
}));

const Dashboard = () => {
  const [socket, setSocket] = useState();
  const [loading, setLoading] = useState(true);
  const [stocks, setStocks] = React.useState(STOCK_SYMBOLS);
  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: []
  });
  const graphDataRef = useRef();
  const stocksRef = useRef();
  const classes = useStyles();

  stocksRef.current = stocks;

  useEffect(() => {
    setLiveConnection();

    return () => {
      if (socket) {
        socket.close();
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (socket) {
      Object.keys(stocks).forEach((symbol) => {
        if (stocks[symbol]) {
          socket.send(JSON.stringify({ type: "subscribe", symbol }));
        } else {
          socket.send(JSON.stringify({ type: "unsubscribe", symbol }));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stocks]);

  /**
   * Update the socket subscription removing and adding symbols
   * @param {*} socket - the socket instance
   */
  const updateSocketSymbols = (socket) => {
    Object.keys(stocks).forEach((symbol) => {
      if (stocks[symbol]) {
        socket.send(JSON.stringify({ type: "subscribe", symbol }));
      }
    });
  };

  /**
   * Creates or updates the socket subscription removing and adding symbols
   */
  const setLiveConnection = () => {
    let newSocket = socket;
    if (!newSocket || newSocket.readyState !== 1) {
      const socket = new WebSocket(`wss://ws.finnhub.io?token=${API_TOKEN}`);
      setSocket(socket);

      socket.addEventListener("open", function (event) {
        setLoading(false);
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

    if (!parsedData) return;

    const selectedSymbols = [];
    Object.keys(stocksRef.current).forEach((symbol) => {
      if (stocksRef.current[symbol]) {
        selectedSymbols.push(symbol);
      }
    });

    const transformedData = transformliveData(
      parsedData,
      graphDataRef.current,
      selectedSymbols
    );
    graphDataRef.current = transformedData;
    setGraphData(transformedData);
  };

  const handleChange = (event) => {
    setStocks({ ...stocks, [event.target.name]: event.target.checked });
  };

  return (
    <div>
      <div className={classes.graphContainer}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Select Stock</FormLabel>
          <FormGroup row>
            {Object.keys(STOCK_SYMBOLS).map((symbol) => {
              return (
                <FormControlLabel
                  key={symbol}
                  control={
                    <Checkbox
                      disabled={loading}
                      checked={stocks[symbol]}
                      onChange={handleChange}
                      name={symbol}
                    />
                  }
                  label={symbol}
                />
              );
            })}
          </FormGroup>
        </FormControl>
        <Typography variant="h5" align="center">
          Price
        </Typography>
        <Line
          data={graphData}
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
              display: true
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
    </div>
  );
};

export default Dashboard;
