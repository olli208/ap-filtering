import { data } from "../../../../data";

export default function handler(req, res) {
  const { color } = req.query;
  const cleanFilter = color[0].split("&");

  const filteredList = data.edges
    .filter((dataPoint) => dataPoint.node.colorFamily)
    .filter((item) => {
      return Object.values(item.node.colorFamily[0]).some((el) =>
        cleanFilter.includes(el)
      );
    });

  res.status(200).json({ data: filteredList });
}
