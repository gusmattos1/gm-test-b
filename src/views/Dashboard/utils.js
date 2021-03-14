export const getUnixTime = (date) => {
  return (date.getTime() / 1000) | 0;
};

const groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const getRandomColor = () => {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return (color += "c7");
};

export const transformliveData = (data, prevDataGroups, selectedSymbols) => {
  let filteredDataSets;
  let mainLabels;

  if (!prevDataGroups) {
    mainLabels = [];
    filteredDataSets = [];
  } else {
    filteredDataSets = prevDataGroups.datasets.filter((data) =>
      selectedSymbols.includes(data.label)
    );
    mainLabels = prevDataGroups.labels;
  }
  const newDataSets = [...filteredDataSets];

  const groupedData = groupBy(data, "s");

  Object.keys(groupedData).forEach((key) => {
    let prevDataSet = newDataSets.find((set) => set.label === key);
    let newDataSet;
    if (prevDataSet) {
      newDataSet = prevDataSet;
    } else {
      newDataSet = { label: key, data: [], borderColor: getRandomColor() };
      newDataSets.push(newDataSet);
    }
    groupedData[key].forEach((trade) => {
      const timestamp = new Date(trade.t).toLocaleTimeString();
      const value = Number(trade.p).toFixed(2);

      if (timestamp && value) {
        mainLabels.push(timestamp);
        newDataSet.data.push(value);
        if (mainLabels.length > 150) {
          newDataSet.data.shift();
          mainLabels.shift();
        }
      }
    });
  });

  return { labels: mainLabels, datasets: newDataSets };
};
