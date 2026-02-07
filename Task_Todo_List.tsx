import { useState } from "react";
import "./Todo.css";

interface Card {
  id: number;
  title: string;
}

interface Column {
  id: "todo" | "progress" | "done";
  title: string;
  cards: Card[];
}

const Todo = () => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draggedCard, setDraggedCard] = useState<{
    card: Card;
    fromColumn: Column["id"];
  } | null>(null);

  const [columns, setColumns] = useState<Column[]>([
    {
      id: "todo",
      title: "Todo",
      cards: [
        { id: 1, title: "First Todo task" },
        { id: 2, title: "Second Todo task" },
      ],
    },
    {
      id: "progress",
      title: "In Progress",
      cards: [{ id: 3, title: "In-progress task " }],
    },
    {
      id: "done",
      title: "Done",
      cards: [{ id: 4, title: "Completed task" }],
    },
  ]);

  // ➕ Add card
  const addCard = (columnId: Column["id"]) => {
    const id = Date.now();
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, cards: [...col.cards, { id, title: "New Card" }] }
          : col,
      ),
    );
    setEditingId(id);
  };

  const updateCard = (cardId: number, value: string) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.map((c) =>
          c.id === cardId ? { ...c, title: value } : c,
        ),
      })),
    );
  };


  const deleteCard = (cardId: number) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.filter((c) => c.id !== cardId),
      })),
    );
  };

  const handleDrop = (toColumn: Column["id"]) => {
    if (!draggedCard) return;

    setColumns((prev) => {
      const updated = prev.map((col) => {
        if (col.id === draggedCard.fromColumn) {
          return {
            ...col,
            cards: col.cards.filter((c) => c.id !== draggedCard.card.id),
          };
        }

        if (col.id === toColumn) {
          return {
            ...col,
            cards: [...col.cards, draggedCard.card],
          };
        }

        return col;
      });

      return updated;
    });

    setDraggedCard(null);
  };

  return (
    <div className="Main">
      {columns.map((column) => (
        <div
          key={column.id}
          className="Todo_starting"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(column.id)}
        >
          <h3 className={`todo-header ${column.id}`}>
            {column.title}
            <span>{column.cards.length}</span>
          </h3>

          <button className="add-card-btn" onClick={() => addCard(column.id)}>
            + Add Card
          </button>

          {column.cards.map((card) => (
            <div
              key={card.id}
              className="todo-card"
              draggable
              onDragStart={() =>
                setDraggedCard({
                  card,
                  fromColumn: column.id,
                })
              }
            >
              <div className={`left-bar ${column.id}`} />

              <div className="card-content">
                {editingId === card.id ? (
                  <input
                    autoFocus
                    value={card.title}
                    onChange={(e) => updateCard(card.id, e.target.value)}
                    onBlur={() => setEditingId(null)}
                    onKeyDown={(e) => e.key === "Enter" && setEditingId(null)}
                  />
                ) : (
                  <div
                    className="card-title"
                    onDoubleClick={() => setEditingId(card.id)}
                  >
                    {card.title}
                  </div>
                )}
              </div>

              <button
                className="delete-btn"
                onClick={() => deleteCard(card.id)}
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Todo;
