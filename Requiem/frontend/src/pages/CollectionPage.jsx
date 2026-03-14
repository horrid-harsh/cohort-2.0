import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axios.instance";
import PageWrapper from "../components/layout/PageWrapper";
import Topbar from "../components/layout/Topbar";
import SaveCard from "../features/saves/components/SaveCard";
import styles from "./CollectionPage.module.scss";
import useDebounce from "../hooks/useDebounce";

const CollectionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useQuery({
    queryKey: ["collection", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/collections/${id}`);
      return res.data.data;
    },
  });

  const collection = data?.collection;
  const saves = data?.saves || [];

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
                <span className={styles.emoji}>{collection?.emoji}</span>
                <div>
                  <h1>{collection?.name}</h1>
                  {collection?.description && <p>{collection.description}</p>}
                </div>
              </div>
              <span className={styles.count}>{filtered.length} saves</span>
            </div>

            {filtered.length === 0 ? (
              <div className={styles.empty}>
                <p>No saves in this collection yet.</p>
                <span>Add saves to this collection from the dashboard.</span>
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

export default CollectionPage;
