import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axios.instance";
import PageWrapper from "../components/layout/PageWrapper";
import Topbar from "../components/layout/Topbar";
import SaveCard from "../features/saves/components/SaveCard";
import styles from "./TagPage.module.scss";
import useDebounce from "../hooks/useDebounce";

const TagPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  // fetch all saves that have this tag
  const { data: savesData, isLoading } = useQuery({
    queryKey: ["saves-by-tag", id],
    queryFn: async () => {
      const res = await axiosInstance.get("/saves", { params: { tag: id } });
      return res.data.data;
    },
  });

  // fetch tag info
  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const res = await axiosInstance.get("/tags");
      return res.data.data;
    },
  });

  const tag = Array.isArray(tagsData) ? tagsData.find((t) => t._id === id) : null;
  const saves = savesData?.saves || [];

  const filtered = debouncedSearch
    ? saves.filter((s) =>
        s.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        s.note?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : saves;

  return (
    <PageWrapper>
      <Topbar onSearch={setSearch} />
      <div className={styles.page}>
        {isLoading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <>
            <div className={styles.header}>
              <button className={styles.back} onClick={() => navigate(-1)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <div className={styles.meta}>
                <span
                  className={styles.tagDot}
                  style={{ background: tag?.color || "#7c6af7" }}
                />
                <div>
                  <h1>#{tag?.name || "tag"}</h1>
                  <p>{filtered.length} {filtered.length === 1 ? "save" : "saves"}</p>
                </div>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className={styles.empty}>
                <p>No saves with this tag.</p>
                <span>Add this tag to saves from the dashboard.</span>
              </div>
            ) : (
              <div className={styles.grid}>
                {filtered.map((save) => (
                  <SaveCard key={save._id} save={save} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
};

export default TagPage;
