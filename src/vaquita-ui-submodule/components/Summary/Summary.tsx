import React from "react";
import { ItemsSummary } from "./Summary.types";

export const Summary = ({ itemsSummary }: { itemsSummary: ItemsSummary[] }) => {
  return (
    <div className=" text-black py-2 px-4 rounded-lg">
      {itemsSummary.map((item, index) => (
        <div key={index} className="flex justify-between py-1">
          <span className="font-thin">{item.title}</span>
          <span className="text-lg">{item.result}</span>
        </div>
      ))}
    </div>
  );
};
