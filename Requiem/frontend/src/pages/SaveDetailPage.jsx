import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/axios.instance";
import PageWrapper from "../components/layout/PageWrapper";
import Topbar from "../components/layout/Topbar";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useUpdateSave, useDeleteSave } from "../features/saves/hooks/useSaves";
import { useCollections } from "../features/collections/hooks/useCollections";
import { useTags } from "../features/tags/hooks/useTags";
import styles from "./SaveDetailPage.module.scss";

const TYPE_LABELS = {
  article: { label: "Article", color: "#378ADD" },
  video:   { label: "Video",   color: "#D85A30" },
  tweet:   { label: "Tweet",   color: "#1D9E75" },
  pdf:     { label: "PDF",     color: "#f87171" },
  image:   { label: "Image",   color: "#D4537E" },
  link:    { label: "Link",    color: "#888888" },
};

const SaveDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [note, setNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const [newHighlight, setNewHighlight] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["save", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/saves/${id}`);
      return res.data.data;
    },
  });

  const { data: collections = [] } = useCollections();
  const { data: tags = [] } = useTags();
  const { mutate: updateSave, isPending: isSaving } = useUpdateSave();
  const { mutate: deleteSave } = useDeleteSave();

  useEffect(() => {
    if (data?.note !== undefined) setNote(data.note);
  }, [data]);

  const save = data;
  const typeInfo = TYPE_LABELS[save?.type] || TYPE_LABELS.link;

  const handleSaveNote = () => {
    updateSave({ id, note }, {
      onSuccess: () => {
        setNoteSaved(true);
        setTimeout(() => setNoteSaved(false), 2000);
        queryClient.invalidateQueries({ queryKey: ["save", id] });
      },
    });
  };

  const handleToggleFavorite = () => {
    updateSave({ id, isFavorite: !save.isFavorite });
  };

  const handleToggleCollection = async (colId) => {
    const isAdded = save.collections?.some((c) => c._id === colId || c === colId);
    if (isAdded) {
      await axiosInstance.delete(`/collections/${colId}/saves/${id}`);
    } else {
      await axiosInstance.patch(`/collections/${colId}/saves/${id}`);
    }
    queryClient.invalidateQueries({ queryKey: ["save", id] });
    queryClient.invalidateQueries({ queryKey: ["saves"] });
    queryClient.invalidateQueries({ queryKey: ["collections"] });
  };

  const handleToggleTag = async (tagId) => {
    const isAdded = save.tags?.some((t) => t._id === tagId || t === tagId);
    if (isAdded) {
      await axiosInstance.delete(`/tags/${tagId}/saves/${id}`);
    } else {
      await axiosInstance.patch(`/tags/${tagId}/saves/${id}`);
    }
    queryClient.invalidateQueries({ queryKey: ["save", id] });
    queryClient.invalidateQueries({ queryKey: ["saves"] });
  };

  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    const existing = save.highlights || [];
    updateSave(
      { id, highlights: [...existing, { text: newHighlight }] },
      {
        onSuccess: () => {
          setNewHighlight("");
          queryClient.invalidateQueries({ queryKey: ["save", id] });
        },
      }
    );
  };

  const handleDeleteHighlight = (index) => {
    const updated = save.highlights.filter((_, i) => i !== index);
    updateSave({ id, highlights: updated }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["save", id] }),
    });
  };

  const handleDelete = () => {
    deleteSave(id, { onSuccess: () => navigate("/") });
  };

  const isInCollection = (colId) =>
    save?.collections?.some((c) => c._id === colId || c === colId);

  const hasTag = (tagId) =>
    save?.tags?.some((t) => t._id === tagId || t === tagId);

  if (isLoading) {
    return (
      <PageWrapper>
        <Topbar />
        <div className={styles.loading}>Loading...</div>
      </PageWrapper>
    );
  }

  if (!save) {
    return (
      <PageWrapper>
        <Topbar />
        <div className={styles.loading}>Save not found.</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Topbar />
      <div className={styles.page}>
        <div className={styles.inner}>
          {/* Back */}
          <button className={styles.back} onClick={() => navigate(-1)}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {/* Thumbnail */}
          {save.thumbnail && (
            <div className={styles.thumb}>
              <img
                src={save.thumbnail}
                alt={save.title}
                loading="eager"
                decoding="async"
              />
            </div>
          )}

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.siteRow}>
              {save.favicon && (
                <img
                  src={save.favicon}
                  alt=""
                  width={14}
                  height={14}
                  className={styles.favicon}
                />
              )}
              <span className={styles.siteName}>{save.siteName}</span>
              <span
                className={styles.typeBadge}
                style={{
                  color: typeInfo.color,
                  borderColor: `${typeInfo.color}30`,
                }}
              >
                {typeInfo.label}
              </span>
            </div>

            <h1 className={styles.title}>{save.title || save.url}</h1>

            {save.description && (
              <p className={styles.description}>{save.description}</p>
            )}

            <div className={styles.headerActions}>
              <a
                href={save.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.openBtn}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Open URL
              </a>

              <button
                className={`${styles.iconBtn} ${save.isFavorite ? styles.favorited : ""}`}
                onClick={handleToggleFavorite}
                title={save.isFavorite ? "Unfavorite" : "Favorite"}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill={save.isFavorite ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>

              <button
                className={`${styles.iconBtn} ${styles.deleteBtn}`}
                onClick={() => setShowConfirm(true)}
                title="Delete"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.grid}>
            {/* Left column */}
            <div className={styles.left}>
              {/* Note */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3>Note</h3>
                </div>
                <textarea
                  className={styles.noteInput}
                  placeholder="Add a note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                />
                <div className={styles.noteActions}>
                  {noteSaved && <span className={styles.saved}>Saved!</span>}
                  <button
                    className={styles.saveNoteBtn}
                    onClick={handleSaveNote}
                    disabled={isSaving || note === save.note}
                  >
                    {isSaving ? "Saving..." : "Save note"}
                  </button>
                </div>
              </div>

              {/* Highlights */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3>Highlights</h3>
                </div>

                {save.highlights?.length > 0 && (
                  <div className={styles.highlights}>
                    {save.highlights.map((h, i) => (
                      <div key={i} className={styles.highlight}>
                        <span className={styles.highlightBar} />
                        <p>{h.text}</p>
                        <button
                          className={styles.removeHighlight}
                          onClick={() => handleDeleteHighlight(i)}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M18 6 6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className={styles.addHighlight}>
                  <textarea
                    placeholder="Paste a highlight..."
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    rows={2}
                    className={styles.highlightInput}
                  />
                  <button
                    className={styles.addHighlightBtn}
                    onClick={handleAddHighlight}
                    disabled={!newHighlight.trim()}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Meta */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3>Info</h3>
                </div>
                <div className={styles.metaList}>
                  <div className={styles.metaItem}>
                    <span>Saved</span>
                    <span>
                      {new Date(save.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className={styles.metaItem}>
                    <span>Type</span>
                    <span style={{ color: typeInfo.color }}>
                      {typeInfo.label}
                    </span>
                  </div>
                  <div className={styles.metaItem}>
                    <span>Source</span>
                    <span>{save.siteName || "—"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className={styles.right}>
              {/* Tags */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3>Tags</h3>
                </div>
                {tags.length === 0 ? (
                  <p className={styles.emptyText}>
                    No tags yet. Create one from the topbar.
                  </p>
                ) : (
                  <div className={styles.tagsList} data-lenis-prevent>
                    {tags.map((tag) => (
                      <button
                        key={tag._id}
                        className={`${styles.tagItem} ${hasTag(tag._id) ? styles.tagSelected : ""}`}
                        onClick={() => handleToggleTag(tag._id)}
                      >
                        <span
                          className={styles.tagDot}
                          style={{ background: tag.color }}
                        />
                        {tag.name}
                        {hasTag(tag._id) && (
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            style={{ marginLeft: "auto" }}
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Collections */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3>Collections</h3>
                </div>
                {collections.length === 0 ? (
                  <p className={styles.emptyText}>
                    No collections yet. Create one from the topbar.
                  </p>
                ) : (
                   <div className={styles.collectionsList} data-lenis-prevent>
                    {collections.map((col) => (
                      <button
                        key={col._id}
                        className={`${styles.colItem} ${isInCollection(col._id) ? styles.colSelected : ""}`}
                        onClick={() => handleToggleCollection(col._id)}
                      >
                        <span>{col.emoji}</span>
                        <span className={styles.colName}>{col.name}</span>
                        {isInCollection(col._id) && (
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            style={{ marginLeft: "auto" }}
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete save"
        message="This will permanently delete this save. This action cannot be undone."
        confirmLabel="Delete"
        isDanger={true}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </PageWrapper>
  );
};

export default SaveDetailPage;
