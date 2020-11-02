import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_URL, ADMIN_TOKEN } from "../../store/consts.js";
import NotFound from "../NotFound/NotFound";
import Loader from "../../components/Loader";
import prettyBytes from "pretty-bytes";
import { Helmet } from "react-helmet";

export default function YandexFileDownload() {
  let { slug } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [ddlWait, setDdlWait] = useState(5);

  useEffect(() => {
    getFile();
    async function getFile() {
      try {
        let result = await axios.get(API_URL + "/links/yandex/" + slug, {
          headers: { authorization: ADMIN_TOKEN },
        });
        if (result.data.linkExists) {
          setFile(result.data);
          setLoading(false);
          setInterval(() => {
            setDdlWait(ddlWait - 1);
          }, 1000);
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        setFile(false);
      }
    }
  }, [slug]);

  return (
    <div>
      <div className="container bg-light w-100 h-100">
        <div className="row">
          <div className="col-8 mx-auto">
            <div className="card card-signin my-5">
              <div className="card-body">
                {loading ? (
                  <div className="col d-flex justify-content-center">
                    <Loader color="warning" />
                  </div>
                ) : file ? (
                  <div className="justify-content-center">
                    <Helmet>
                      <title>CM Sharer - {file.fileName}</title>
                    </Helmet>
                    <h1>{file.fileName}</h1>
                    <p>SIZE: {prettyBytes(Number(file.size) || 0)}</p>
                    <p>{file.fileType}</p>
                    <br />
                    <button
                      className="btn btn-lg btn-warning"
                      disabled={ddlWait > 0 ? true : false}
                    >
                      {ddlWait > 0 ? (
                        `Please wait ${ddlWait} secs...`
                      ) : (
                        <a
                          className="text-white"
                          href={file.DDL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download
                        </a>
                      )}
                    </button>
                  </div>
                ) : (
                  <NotFound />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
