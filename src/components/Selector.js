import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ListSubheader from "@material-ui/core/ListSubheader";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import { VariableSizeList } from "react-window";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Checkbox from "@material-ui/core/Checkbox";

const LISTBOX_PADDING = 6; // px
const MAX_SIMULTANEOUS_SELECTIONS = 4;

const renderRow = (props) => {
  const { data, index, style } = props;
  return React.cloneElement(data[index], {
    style: {
      ...style,
      top: style.top + LISTBOX_PADDING,
    },
  });
};

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

const useResetCache = (data) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
};

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(
  props,
  ref
) {
  const { children, ...other } = props;
  const itemData = React.Children.toArray(children);
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true });
  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child) => {
    if (React.isValidElement(child) && child.type === ListSubheader) {
      return 48;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

ListboxComponent.propTypes = {
  children: PropTypes.node,
};

const useStyles = makeStyles({
  listbox: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

const renderGroup = (params) => [
  <ListSubheader key={params.key} component="div">
    {params.group}
  </ListSubheader>,
  params.children,
];

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const Selector = ({ options, setSelectedSymbols }) => {
  const [selectorValues, setSelectorValues] = React.useState([]);
  const classes = useStyles();

  const storeSelections = (values) => {
    setSelectorValues(values);
    localStorage.setItem("selections", JSON.stringify(values));
  };

  React.useEffect(() => {
    const selections = localStorage.getItem("selections");
    const parsedSel = JSON.parse(selections);

    if (parsedSel && parsedSel.length > 0) {
      setSelectorValues(parsedSel);
      setSelectedSymbols(parsedSel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNewSelections = (event, newValue) => {
    if (newValue.length > MAX_SIMULTANEOUS_SELECTIONS) {
      alert(`Max ${MAX_SIMULTANEOUS_SELECTIONS} selections.`);
      return;
    }

    setSelectedSymbols(newValue);
    storeSelections(newValue);
  };

  return (
    <>
      <Autocomplete
        id="stock-selector"
        value={selectorValues}
        onChange={handleNewSelections}
        multiple
        limitTags={4}
        style={{ width: "80%", maxWidth: 500 }}
        disableListWrap
        disableCloseOnSelect
        classes={classes}
        ListboxComponent={ListboxComponent}
        renderGroup={renderGroup}
        getOptionLabel={(option) => option}
        options={options}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Stocks" />
        )}
        renderOption={(option, { selected }) => (
          <React.Fragment>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option}
          </React.Fragment>
        )}
      />
    </>
  );
};

export default Selector;
