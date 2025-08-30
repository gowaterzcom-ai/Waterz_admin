import React, { useEffect, useState } from "react";
import { adminAPI, QueryData } from "../../api/admin";
import styles from "../../styles/Query/Query.module.css";
import { toast } from "react-toastify";

const Query: React.FC = () => {
  const [queries, setQueries] = useState<QueryData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // To manage response input per query
  const [responses, setResponses] = useState<{ [key: string]: string }>({});

  const fetchQueries = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminAPI.getQueries();
      // @ts-ignore
      const queryList: QueryData[] = data.queries.map((query: any) => ({
        id: query._id,
        name: query.name,
        email: query.email,
        query: query.message,
        queryAnswer: query.messageResponse || "",
      }));
      setQueries(queryList);
    } catch (err) {
      console.error("Error fetching queries:", err);
      setError("Failed to fetch queries");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleResponseChange = (id: string, value: string) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  };

  const handleSendResponse = async (queryItem: QueryData) => {
    const queryAnswer = responses[queryItem.id];
    if (!queryAnswer || queryAnswer.trim() === "") {
      toast.error("Response cannot be empty");
      return;
    }
    try {
      // Prepare the payload for the API call
      const payload: QueryData = {
        id: queryItem.id,
        name: queryItem.name,
        email: queryItem.email,
        query: queryItem.query,
        queryAnswer: queryAnswer,
      };
      await adminAPI.queryResponse(payload);
      toast.success("Response sent successfully");
      // Update the local state to show the response in the UI
      setQueries((prev) =>
        prev.map((q) =>
          q.id === queryItem.id ? { ...q, queryAnswer } : q
        )
      );
    } catch (err) {
      console.error("Error sending response:", err);
      toast.error("Failed to send response");
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading queries...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.queriesContainer}>
      <h1 className={styles.title}>User Queries</h1>
      <div className={styles.queriesList}>
        {queries.map((queryItem) => (
          <div key={queryItem.id} className={styles.queryCard}>
            <div className={styles.queryHeader}>
              <h3>{queryItem.name}</h3>
              <p className={styles.email}>{queryItem.email}</p>
            </div>
            <div className={styles.queryBody}>
              <p className={styles.queryText}>{queryItem.query}</p>
              {queryItem.queryAnswer ? (
                <div className={styles.responseSection}>
                  <h4>Response</h4>
                  <p className={styles.responseText}>{queryItem.queryAnswer}</p>
                </div>
              ) : (
                <div className={styles.responseForm}>
                  <textarea
                    placeholder="Type your response here..."
                    value={responses[queryItem.id] || ""}
                    onChange={(e) =>
                      handleResponseChange(queryItem.id, e.target.value)
                    }
                    className={styles.textarea}
                  />
                  <button
                    onClick={() => handleSendResponse(queryItem)}
                    className={styles.sendButton}
                  >
                    Send Response
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Query;
