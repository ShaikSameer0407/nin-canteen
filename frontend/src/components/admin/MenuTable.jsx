export default function MenuTable({ menu, onDelete, onToggle }) {
  return (
    <table className="w-full bg-white shadow rounded">
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Available</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {menu.map((m) => (
          <tr key={m.id}>
            <td>{m.name}</td>
            <td>₹{m.price}</td>
            <td>
              <input
                type="checkbox"
                checked={m.isAvailable}
                onChange={(e) => onToggle(m.id, e.target.checked)}
              />
            </td>
            <td>
              <button onClick={() => onDelete(m.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
