import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axios.instance";
import PageWrapper from "../components/layout/PageWrapper";
import Topbar from "../components/layout/Topbar";
import SaveCard from "../features/saves/components/SaveCard";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EditCollectionModal from "../features/collections/components/EditCollectionModal";
import { useDeleteCollection } from "../features/collections/hooks/useCollections";
import styles from "./CollectionPage.module.scss";
import useDebounce from "../hooks/useDebounce";

const CollectionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useQuery({
    queryKey: ["collection", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/collections/${id}`);
      return res.data.data;
    },
  });

  const { mutate: deleteCollection, isPending } = useDeleteCollection();

  const collection = data?.collection;
  const saves = data?.saves || [];

  const filtered = debouncedSearch
    ? saves.filter((s) =>
        s.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        s.note?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : saves;

  const handleDelete = () => {
    deleteCollection(id, { onSuccess: () => navigate("/") });
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
                  <span className={styles.emoji}>{collection?.emoji}</span>
                  <div>
                    <h1>{collection?.name}</h1>
                    {collection?.description && <p>{collection.description}</p>}
                  </div>
                </div>

                <div className={styles.headerActions}>
                  <span className={styles.count}>
                    {filtered.length} {filtered.length === 1 ? "save" : "saves"}
                  </span>

                  <div className={styles.menuWrap}>
                    <button className={styles.menuBtn} onClick={() => setMenuOpen((p) => !p)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="5" cy="12" r="2" />
                        <circle cx="12" cy="12" r="2" />
                        <circle cx="19" cy="12" r="2" />
                      </svg>
                    </button>

                    {menuOpen && (
                      <div className={styles.menu}>
                        <button
                          className={styles.menuItem}
                          onClick={() => { setMenuOpen(false); setShowEdit(true); }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          Edit collection
                        </button>
                        <button
                          className={`${styles.menuItem} ${styles.danger}`}
                          onClick={() => { setMenuOpen(false); setShowConfirm(true); }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                          </svg>
                          Delete collection
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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

      <EditCollectionModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        collection={collection}
      />

      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete collection"
        message={`Delete "${collection?.name}"? Saves inside will not be deleted.`}
        confirmLabel={isPending ? "Deleting..." : "Delete"}
        isDanger={true}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </PageWrapper>
  );
};

export default CollectionPage;