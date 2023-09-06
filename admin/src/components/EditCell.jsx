export const EditCell = ({ row, table }) => {
    const meta = table.options.meta;

    const setEditedRows = (e) => {
        if (meta && meta.setEditedRows) {
            meta.setEditedRows((old) => ({
                ...old,
                [row.id]: !old[row.id],
            }));
        }
    };

    const removeRow = () => {
        meta?.removeRow(row.index);
    };

    return (
        <div className="w-15 align-content-center">
            {meta?.editedRows[row.id] ? (
                <div>
                    <button className="bg-gray-100 rounded-full w-7 h-7 text-gray-600" onClick={setEditedRows} name="cancel">
                        ⚊
                    </button>
                    <span className="px-0.5" />
                    <button className="bg-green-100 rounded-full w-7 h-7 text-green-600" onClick={setEditedRows} name="done">
                        ✔
                    </button>
                </div>
            ) : (
                <div>
                        <button className="bg-yellow-200 rounded-full w-7 h-7 text-yellow-600" onClick={setEditedRows} name="edit">
                        ✐
                    </button>
                    <span className="px-0.5" />
                        <button className="bg-red-200 rounded-full w-7 h-7 text-red-600" onClick={removeRow} name="remove">
                        X
                    </button>
                </div>
            )}
        </div>
    );
};
