import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const BarRatingBucket = ({ data }) => {
  // Convert to array and sort by bucket range (e.g., "800-899" => 800)


  const chartData = Object.entries(data || {})
    .map(([bucket, count]) => ({
      rating: bucket,
      count,
      sortKey: parseInt(bucket.split('-')[0]) || 0
    }))
    .sort((a, b) => a.sortKey - b.sortKey);
    

  return (
    <div style={styles.chartContainer}>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="rating" stroke="#4a5568" fontSize={12} />
            <YAxis stroke="#4a5568" allowDecimals={false} fontSize={12} />
            <Tooltip contentStyle={{ fontSize: '12px' }} />
            <Bar dataKey="count" fill="#4299e1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p style={{ textAlign: 'center', padding: '1rem', color: '#718096' }}>No data available</p>
      )}
    </div>
  );
};

const styles = {
  chartContainer: {
    marginTop: '20px',
    backgroundColor: '#edf2f7',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)'
  }
};
