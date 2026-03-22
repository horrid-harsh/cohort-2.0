import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getClustersApi } from "../features/graph/services/graph.service";
import PageWrapper from "../components/layout/PageWrapper";
import Topbar from "../components/layout/Topbar";
import styles from "./ClusterPage.module.scss";

const TYPE_COLORS = {
  article: "#378ADD",
  video:   "#D85A30",
  tweet:   "#1D9E75",
  pdf:     "#f87171",
  image:   "#D4537E",
  link:    "#888888",
};

const ClusterPage = () => {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const { data: clusters = [], isLoading, isFetching, refetch, isFetched, error } = useQuery({
    queryKey: ["clusters"],
    queryFn: getClustersApi,
    staleTime: 1000 * 60 * 30, // keep for 30 mins
    enabled: false,             // don't auto-fetch on mount
    retry: false,
  });

  const isGenerating = isLoading || isFetching;

  const toggleCluster = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <PageWrapper>
      <Topbar />
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1>Topic clusters</h1>
            <p>AI groups your saves by topic automatically</p>
          </div>
          <button
            className={styles.generateBtn}
            onClick={() => refetch()}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <div className={styles.spinner} />
                Clustering...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                {isFetched ? "Re-cluster" : "Generate clusters"}
              </>
            )}
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            {error.response?.data?.message || "Failed to generate clusters"}
          </div>
        )}

        {!isFetched && !isGenerating && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>⬡</div>
            <p>Click "Generate clusters" to let AI group your saves by topic.</p>
            <span>Needs at least 4 saves with AI tags to work.</span>
          </div>
        )}

        {isGenerating && (
          <div className={styles.loadingState}>
            <div className={styles.bigSpinner} />
            <p>Analyzing your saves...</p>
            <span>This may take a few seconds</span>
          </div>
        )}

        {isFetched && !isGenerating && clusters.length === 0 && (
          <div className={styles.emptyState}>
            <p>Not enough saves to cluster.</p>
            <span>Save more URLs and let AI tag them first.</span>
          </div>
        )}

        {!isGenerating && clusters.length > 0 && (
          <div className={styles.clusters}>
            {clusters.map((cluster, i) => (
              <div
                key={i}
                className={`${styles.cluster} ${expandedIndex === i ? styles.isExpanded : ""}`}
              >
                <div
                  className={styles.clusterHeader}
                  onClick={() => toggleCluster(i)}
                >
                  <div className={styles.clusterTitleGroup}>
                    <h2 className={styles.clusterName}>{cluster.name}</h2>
                    <span className={styles.clusterCount}>{cluster.count} saves</span>
                  </div>
                  <svg
                    className={styles.chevron}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>

                <div className={styles.savesListWrap}>
                  <div
                    className={styles.savesList}
                    onClick={(e) => e.stopPropagation()}
                    data-lenis-prevent
                  >
                    {cluster.saves.map((save) => (
                      <div
                        key={save._id}
                        className={styles.saveItem}
                        onClick={() => navigate(`/saves/${save._id}`)}
                      >
                        <div className={styles.saveThumb}>
                          {save.thumbnail ? (
                            <img src={save.thumbnail} alt={save.title} loading="lazy" />
                          ) : (
                            <div
                              className={styles.thumbPlaceholder}
                              style={{ color: TYPE_COLORS[save.type] || TYPE_COLORS.link }}
                            >
                              {save.type?.[0]?.toUpperCase() || "L"}
                            </div>
                          )}
                        </div>
                        <div className={styles.saveInfo}>
                          <p className={styles.saveTitle}>{save.title || save.url}</p>
                          <div className={styles.saveMeta}>
                            <span className={styles.saveSite}>{save.siteName}</span>
                            {save.tags?.slice(0, 2).map((tag) => (
                              <span
                                key={tag._id}
                                className={styles.saveTag}
                                style={{ color: tag.color, borderColor: `${tag.color}30` }}
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        </div>
                        <svg className={styles.saveArrow} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default ClusterPage;