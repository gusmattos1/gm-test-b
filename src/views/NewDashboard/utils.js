export const transformData = (data, symbol) => {
  let newDataSet = {
    labels: [],
    symbol,
    datasets: [
      {
        label: "open",
        data: [],
      },
      {
        label: "close",
        data: [],
        backgroundColor: ["rgba(255, 200, 200, 0.9)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
      },
    ],
  };

  data.c.forEach((item, index) => {
    const close = Number(item).toFixed(2);
    const open = Number(data.o[index]).toFixed(2);
    const timestamp = new Date(data.t[index] * 1000).toLocaleDateString();
    newDataSet.labels.push(timestamp);
    newDataSet.datasets[0].data.push(open);
    newDataSet.datasets[1].data.push(close);
  });
  return newDataSet;
};

export const getUnixTime = (date) => {
  return (date.getTime() / 1000) | 0;
};

const groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export const transformliveData = (
  data,
  prevDataGroups = [],
  selectedSymbols
) => {
  let defaultDatagroup = {
    labels: [],
    symbol: "",
    datasets: [{ label: "Last price", data: [] }],
  };

  const prevData = prevDataGroups.filter(
    (data) => !selectedSymbols.includes(data.symbol)
  );

  const newDataGroup = [...prevData];

  const groupedData = groupBy(data, "s");

  Object.keys(groupedData).forEach((key) => {
    let prevDatagroup = newDataGroup.find((set) => (set.symbol = key));
    let newData;
    let newDataSet;

    if (prevDatagroup) {
      newData = prevDatagroup;
    } else {
      newData = defaultDatagroup;
      newData.symbol = key;
      newData.datasets[0].label = key;
      newDataGroup.push(newData);
    }

    newDataSet = newData.datasets[0];

    groupedData[key].forEach((trade) => {
      const timestamp = new Date(trade.t).toLocaleTimeString();
      const value = Number(trade.p).toFixed(2);

      if (timestamp && value) {
        newData.error = false;
        newData.labels.push(timestamp);
        newDataSet.data.push(value);
        if (newData.labels.length > 150) {
          newDataSet.data.shift();
          newData.labels.shift();
        }
      }
    });
  });

  selectedSymbols.forEach((symbol) => {
    if (!newDataGroup.find((item) => item.symbol === symbol)) {
      newDataGroup.push({
        ...defaultDatagroup,
        error: "No Data Available",
        symbol: symbol,
      });
    }
  });

  return newDataGroup;
};
