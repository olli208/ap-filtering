import { data as articles } from "../data/data";

// const getFilterOption = (arr, item, getItem) => {
//   const getItemInside = (items) => arr[item];

//   return arr
//     .filter((item) => getItemInside(item.node))
//     .map((mappedItems) => getItemInside(mappedItems.node)[0])
//     .reduce(
//       (prev, currentItem) =>
//         !prev.includes(getItem(currentItem))
//           ? [...prev, getItem(currentItem)]
//           : [...prev],
//       []
//     );
// };

export const getServerSideProps = async (context) => {
  const getColorFamily = (item) => item.name;

  const getFilters = articles.edges
    .filter((item) => item.node["colorFamily"])
    .map((mappedItems) => mappedItems.node["colorFamily"][0])
    .reduce(
      (prev, currentItem) =>
        !prev.includes(getColorFamily(currentItem))
          ? [...prev, getColorFamily(currentItem)]
          : [...prev],
      []
    );

  return {
    props: {
      articlesList: articles.edges.slice(0, 30),
      colorOptions: getFilters,
    },
  };
};

export default ({ articlesList, colorOptions }) => {
  console.log({ articlesList, colorOptions });
  return (
    <>
      <div>
        filter by:
        <ul>
          {colorOptions.map((color, i) => (
            <li key={i}>{color}</li>
          ))}
        </ul>
      </div>
      <ul>
        {articlesList.map((item, i) => {
          return <li key={i}>{item.node.name}</li>;
        })}
      </ul>
    </>
  );
};
