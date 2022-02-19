import { useEffect, useState } from "react";
import { endpoint } from "../config";

const getFilterOptions = (arr, filterType, getItem) =>
  arr
    .filter((item) => item.node[filterType])
    .map((mappedItems) => mappedItems.node[filterType][0])
    .reduce(
      (prev, currentItem) =>
        !prev.includes(getItem(currentItem))
          ? [...prev, getItem(currentItem)]
          : [...prev],
      []
    );

export const getStaticProps = async (context) => {
  const getData = await fetch(`${endpoint}/articles`);
  const { data } = await getData.json();

  return {
    props: {
      totalArticles: data.length,
      articlesList: data.slice(0, 30),
      colorOptions: getFilterOptions(data, "colorFamily", (item) => item.name),
    },
  };
};

export default ({ totalArticles, articlesList, colorOptions }) => {
  const [filters, setFilters] = useState([]);
  const [data, setData] = useState(articlesList);

  const handleFilterClick = (color) => {
    setFilters((state) => {
      if (state.includes(color)) return state.filter((item) => item !== color);

      return [...state, color];
    });
  };

  const handleSearch = (ev) => {
    ev.preventDefault();
    const value = ev.currentTarget.value;

    setData(
      articlesList.filter((item) =>
        item.node.name
          .toLowerCase()
          .startsWith(value.slice(0, Math.max(item.node.name.length - 1, 1)))
      )
    );
  };

  useEffect(() => {
    console.log("gettign data ");
    if (filters.length === 0) return setData(articlesList);

    const getData = async () => {
      const req = await fetch(
        `${endpoint}/articles/colors/${filters.join("&")}`
      );
      const data = await req.json();
      setData(data.data);
    };

    getData();
  }, [filters]);

  return (
    <>
      <div>
        <input onChange={handleSearch} type="text" />
        filter by:
        <ul>
          {colorOptions?.map((color, i) => (
            <li key={i}>
              <button onClick={() => handleFilterClick(color)}>{color}</button>
            </li>
          ))}
        </ul>
        <button onClick={() => setFilters([])}>reset filters</button>
      </div>
      <span>
        showing {data.length} of {totalArticles}
      </span>
      <ul>
        {data?.map((item, i) => {
          return <li key={i}>{item.node.name}</li>;
        })}
      </ul>
    </>
  );
};
