import { data } from "../../../data";

export default function handler(req, res) {
  // not the best solution here but couldnt find a way
  // for next to handle mutliple query params in a format i am used to
  const { filter } = req.query;
  const getFilters = filter.map((filter) => {
    const splitFilter = filter.split("=");
    return { [splitFilter[0]]: splitFilter[1].split("&") };
  });

  const obj = { ...getFilters };
  console.log(obj);

  res.status(200).json({ data: data.edges });
}
