import React, { useState } from "react";
import { Button } from "strapi-helper-plugin";
import { saveAs } from "file-saver";
import { fetchEntries } from "../../utils/contentApis";
import { HFlex, ModelItem } from "./ui-components";
import JsonDataDisplay from "../../components/JsonDataDisplay";
import { unparse } from "papaparse";

const ExportModel = ({ model }) => {
  const [fetching, setFetching] = useState(false);
  const [content, setContent] = useState(null);
  const fetchModelData = () => {
    setFetching(true);
    fetchEntries(model.apiID, model.schema.kind)
      .then((data) => {
        setContent(data);
      })
      .finally(() => {
        setFetching(false);
      });
  };

  const downloadJson = () => {
    try {
      const current = new Date();
      content.sort((a, b) => a.id - b.id);
      const file = new File(
        [JSON.stringify(content)],
        `${model.apiID}-${current.getTime()}.json`,
        {
          type: "application/json;charset=utf-8",
        }
      );
      saveAs(file);
    } catch (error) {
      console.error(error);
    }
  };

  const downloadCSV = () => {
    try {
      const current = new Date();
      content.sort((a, b) => a.id - b.id);
      const csv = unparse(content);
      const file = new File([csv], `${model.apiID}-${current.getTime()}.csv`, {
        type: "text/csv;charset=utf-8",
      });
      saveAs(file);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ModelItem>
      <HFlex>
        <span className="title">{model.schema.name}</span>
        <div>
          <Button
            disabled={fetching}
            loader={fetching}
            onClick={fetchModelData}
            secondaryHotline
          >
            {fetching ? "Fetching" : "Fetch"}
          </Button>
          <Button
            disabled={!content}
            onClick={downloadJson}
            kind={content ? "secondaryHotline" : "secondary"}
          >
            Download JSON
          </Button>
          <Button
            disabled={!content}
            onClick={downloadCSV}
            kind={content ? "secondaryHotline" : "secondary"}
          >
            Download CSV
          </Button>
        </div>
      </HFlex>
      {content && <JsonDataDisplay data={content} />}
    </ModelItem>
  );
};

export default ExportModel;
