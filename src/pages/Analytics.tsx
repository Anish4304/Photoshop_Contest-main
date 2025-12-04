import { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import api from '../services/api';

export default function Analytics() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>({});

  const queries = [
    { id: 1, title: 'Photographers in Multiple Categories', endpoint: '/analytics/photographers-multiple-categories' },
    { id: 2, title: 'Highest Scored Photo', endpoint: '/analytics/highest-scored-photo' },
    { id: 3, title: 'Categories with 50+ Submissions', endpoint: '/analytics/categories-high-submissions' },
    { id: 4, title: 'Judges with 20+ Scores', endpoint: '/analytics/judges-high-activity' },
    { id: 5, title: 'Average Votes per Category', endpoint: '/analytics/average-votes-per-category' },
    { id: 6, title: 'Photos in Multiple Galleries', endpoint: '/analytics/photos-multiple-galleries' },
    { id: 7, title: 'Photographers with Multiple Wins', endpoint: '/analytics/photographers-multiple-wins' },
    { id: 8, title: 'Categories with No Winners', endpoint: '/analytics/categories-no-winners' },
    { id: 9, title: 'Visitors with 10+ Votes', endpoint: '/analytics/visitors-high-engagement' },
    { id: 10, title: 'Category with Most Submissions', endpoint: '/analytics/category-most-submissions' },
    { id: 11, title: 'Top 3 Wildlife Winners', endpoint: '/analytics/top-winners/Wildlife' },
    { id: 12, title: 'High Scores but No Awards', endpoint: '/analytics/photographers-high-scores-no-awards' },
  ];

  const fetchQuery = async (endpoint: string, id: number) => {
    setLoading(true);
    try {
      console.log('Fetching:', endpoint);
      const response = await api.get(endpoint);
      console.log('Response:', response.data);
      const data = response.data.data;
      console.log('Setting results for query', id, ':', data);
      setResults((prev: any) => ({ ...prev, [id]: data }));
      
      // Save query log to database
      const query = queries.find(q => q.id === id);
      try {
        await api.post('/query-logs', {
          queryId: id,
          queryTitle: query?.title,
          endpoint,
          results: data,
        });
      } catch (logError) {
        console.error('Error saving log:', logError);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setResults((prev: any) => ({ ...prev, [id]: [] }));
    }
    setLoading(false);
  };

  const fetchAllQueries = async () => {
    setLoading(true);
    for (const query of queries) {
      await fetchQuery(query.endpoint, query.id);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="w-10 h-10 text-amber-500" />
          <h1 className="text-4xl font-bold text-white">Analytics Dashboard</h1>
        </div>

        <button
          onClick={fetchAllQueries}
          disabled={loading}
          className="mb-8 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Run All Queries'}
        </button>

        <div className="grid gap-6">
          {queries.map((query) => (
            <div key={query.id} className="bg-slate-800 rounded-lg p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">{query.id}. {query.title}</h2>
                <button
                  onClick={() => fetchQuery(query.endpoint, query.id)}
                  className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600"
                >
                  Run Query
                </button>
              </div>

              {results[query.id] !== undefined && (
                <div className="bg-slate-900 rounded p-4 overflow-x-auto">
                  {Array.isArray(results[query.id]) ? (
                    results[query.id].length > 0 ? (
                      <table className="w-full text-left text-sm text-slate-300">
                        <thead className="text-xs uppercase bg-slate-800 text-slate-400">
                          <tr>
                            {Object.keys(results[query.id][0]).map((key) => (
                              <th key={key} className="px-4 py-3">{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {results[query.id].map((row: any, idx: number) => (
                            <tr key={idx} className="border-b border-slate-700 hover:bg-slate-800">
                              {Object.values(row).map((val: any, i: number) => (
                                <td key={i} className="px-4 py-3">
                                  {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-slate-400">No results found</p>
                    )
                  ) : (
                    <table className="w-full text-left text-sm text-slate-300">
                      <tbody>
                        {Object.entries(results[query.id]).map(([key, val]: [string, any]) => (
                          <tr key={key} className="border-b border-slate-700">
                            <td className="px-4 py-3 font-semibold text-slate-400">{key}</td>
                            <td className="px-4 py-3">
                              {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
