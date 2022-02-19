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

  const getPriceOptions = data
    .map((item) => item.node.shopifyProductEu.variants.edges[0].node.price)
    .sort((a, b) => a - b);

  return {
    props: {
      totalArticles: data.length,
      articlesList: data.slice(0, 30),
      colorOptions: getFilterOptions(data, "colorFamily", (item) => item.name),
      priceOptions: {
        min: parseInt(getPriceOptions[0]),
        max: parseInt(getPriceOptions[getPriceOptions.length - 1]),
      },
    },
  };
};

export default ({
  totalArticles,
  articlesList,
  colorOptions,
  priceOptions,
}) => {
  const [filters, setFilters] = useState([]);
  const [colorFilters, setColorFilters] = useState([]);
  const [data, setData] = useState(articlesList);
  const [price, setPrice] = useState(priceOptions.max);

  const handleColorClick = (color) => {
    setColorFilters((state) => {
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

  const handlePriceRange = (ev) => {
    ev.preventDefault();
    const value = ev.currentTarget.value;

    setPrice(value);
  };

  useEffect(() => {
    if (colorFilters.length === 0) return setData(articlesList);

    const getData = async () => {
      const req = await fetch(
        `${endpoint}/articles/color=${colorFilters.join("&")}/price=100`
      );
      const data = await req.json();
      setData(data.data);
    };

    getData();
  }, [colorFilters, articlesList]);

  return (
    <>
      <div>
        <input onChange={handleSearch} type="text" />
        filter by:
        <ul>
          {colorOptions?.map((color, i) => (
            <li key={i}>
              <button onClick={() => handleColorClick(color)}>{color}</button>
            </li>
          ))}
        </ul>
        <label>
          <input
            onChange={handlePriceRange}
            value={price}
            type="range"
            name="price"
            min={priceOptions.min}
            max={priceOptions.max}
          />
          Price ({price})
        </label>
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
