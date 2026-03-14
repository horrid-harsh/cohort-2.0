import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axios.instance";
import PageWrapper from "../components/layout/PageWrapper";
import Topbar from "../components/layout/Topbar";
import SaveCard from "../features/saves/components/SaveCard";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useTags, useDeleteTag } from "../features/tags/hooks/useTags";
import styles from "./TagPage.module.scss";
import useDebounce from "../hooks/useDebounce";

const TagPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const debouncedSearch = useDebounce(search);

  const { data: savesData, isLoading } = useQuery({
    queryKey: ["saves-by-tag", id],
    queryFn: async () => {
      const res = await axiosInstance.get("/saves", { params: { tag: id } });
      return res.data.data;
    },
  });

  const { data: tagsData } = useTags();
  const { mutate: deleteTag, isPending } = useDeleteTag();

  const tag = Array.isArray(tagsData) ? tagsData.find((t) => t._id === id) : null;
  const saves = savesData?.saves || [];

  const filtered = debouncedSearch
    ? saves.filter((s) =>
        s.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        s.note?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : saves;

  const handleDelete = () => {
    deleteTag(id, {
      onSuccess: () => navigate("/"),
    });
  };

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

              <div className={styles.metaRow}>
                <div className={styles.meta}>
                  <span className={styles.tagDot} style={{ background: tag?.color || "#7c6af7" }} />
                  <div>
                    <h1>#{tag?.name || "..."}</h1>
                    <p>{filtered.length} {filtered.length === 1 ? "save" : "saves"}</p>
                  </div>
                </div>

                <div className={styles.headerActions}>
                  <div className={styles.menuWrap}>
                    <button
                      className={styles.menuBtn}
                      onClick={() => setMenuOpen((p) => !p)}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="5" cy="12" r="2" />
                        <circle cx="12" cy="12" r="2" />
                        <circle cx="19" cy="12" r="2" />
                      </svg>
                    </button>

                    {menuOpen && (
                      <div className={styles.menu}>
                        <button
                          className={`${styles.menuItem} ${styles.danger}`}
                          onClick={() => { setMenuOpen(false); setShowConfirm(true); }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                          </svg>
                          Delete tag
                        </button>
                      </div>
                    )}
                  </div>
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

      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete tag"
        message={`Delete "#${tag?.name}"? It will be removed from all saves.`}
        confirmLabel={isPending ? "Deleting..." : "Delete"}
        isDanger={true}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </PageWrapper>
  );
};

export default TagPage;
