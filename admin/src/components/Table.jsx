import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import mahasiswa from "../assets/mahasiswa";
import React, { useState, useEffect } from "react";
import Search from "./Search";
import { SearchIcon } from "../assets/Icons";
import { EditCell } from "./EditCell";
import { FooterCell } from "./Footer";
import Call from "./Call";


function Table() {
    const columnHelper = createColumnHelper();
    const [editedRows, setEditedRows] = useState({});
    const [data, setData] = useState(() => [...mahasiswa]);
    const [originalData, setOriginalData] = useState(() => [...mahasiswa]);
    const [globalFilter, setGlobalFilter] = useState("");
    

    const TableCell = ({ getValue, row, column, table }) => {
        const initialValue = getValue();
        const columnMeta = column.columnDef.meta;
        const tableMeta = table.options.meta;
        const [value, setValue] = useState(initialValue);

        useEffect(() => {
            setValue(initialValue);
        }, [initialValue]);
        const onBlur = () => {
            if (tableMeta && tableMeta.updateData) {
                tableMeta.updateData(row.index, column.id, value);
            }
        };
        const onSelectChange = (e) => {
            setValue(e.target.value);
            if (tableMeta && tableMeta.updateData) {
                tableMeta.updateData(row.index, column.id, e.target.value);
            }
        };
        return columnMeta && columnMeta.type === "select" ? (
            <select className="bg-transparent w-20" onChange={onSelectChange} value={initialValue}>
                {columnMeta.options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        ) : (
            <input
                    className="w-20 bg-transparent"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={onBlur}
                type={columnMeta.type || "text"}
            />
        );
    };
    
    const columns = [
        columnHelper.accessor("", {
            id: "S.No",
            cell: (info) => <span>{info.row.index + 1}</span>,
            header: "No"
        }),
        // columnHelper.accessor("id", {
        //     id: "ID",
        //     cell: TableCell,
        //     header: "No",
        //     meta: {
        //         type: "text"
        //     }
        // }),
        columnHelper.accessor("profile", {
            cell: (info) => (
                <img
                    src={info.getValue()}
                    alt="..."
                    className="rounded-full w-10 h-10 object-cover"
                />
            ),
            header: "Profile",
        }),
        // columnHelper.accessor("nim", {
        //     cell: TableCell,
        //     header: "NIM",
        //     meta: {
        //         type: "text"
        //     }
        // }),
        // columnHelper.accessor("nama", {
        //     cell: TableCell,
        //     header: "Nama",
        //     meta: {
        //         type: "text"
        //     }
        // }),
        // columnHelper.accessor("jurusan", {
        //     cell: TableCell,
        //     header: "Jurusan",
        //     meta: {
        //         type: "text"
        //     }
        // }),
        columnHelper.accessor("firstName", {
            cell: TableCell,
            header: "First Name",
            meta: {
                type: "text"
            }
        }),
        columnHelper.accessor("lastName", {
            cell: TableCell,
            header: "Last Name",
            meta: {
                type: "text"
            }
        }),
        columnHelper.accessor("age", {
            cell: TableCell,
            header: "Age",
            meta: {
                type: "number"
            }
        }),
        columnHelper.accessor("major", {
            cell: TableCell,
            header: "Major",
            meta: {
                type: "select",
                options: [
                    { value: "Computer Science", label: "Computer Science" },
                    { value: "Communications", label: "Communications" },
                    { value: "Business", label: "Business" },
                    { value: "Psychology", label: "Psychology" },
                ],
            },
        }),
        columnHelper.display({
            id: "edit",
            // header: "Action",
            cell: EditCell,
        }),
    ]

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
        },
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        meta: {
            editedRows,
            setEditedRows,
            updateData: function (rowIndex, columnId, value) {
                setData(function (old) {
                    return old.map(function (row, index) {
                        if (index === rowIndex) {
                            return {
                                ...old[rowIndex],
                                [columnId]: value,
                            };
                        }
                        return row;
                    });
                });
            },
            addRow: () => {
                const newRow = {
                    studentId: Math.floor(Math.random() * 10000),
                    name: "",
                    dateOfBirth: "",
                    major: "",
                };
                const setFunc = (old) => [...old, newRow];
                setData(setFunc);
                setOriginalData(setFunc);
            },
            removeRow: function (rowIndex) {
                const setFilterFunc = function (old) {
                    return old.filter(function (_row, index) {
                        return index !== rowIndex;
                    });
                };
                setData(setFilterFunc);
                setOriginalData(setFilterFunc);
            },


        }
    });

    return (
        
    // <QueryClientProvider client={queryClient}>
        <div className="p-10 max-w-5xl mx-auto text-gray-800 fill-gray-700">
            <div className="flex justify-between mb-2">
                <div className="w-full flex items-center gap-1">
                    <SearchIcon />
                    <Search
                        value={globalFilter ?? ""}
                        onChange={(value) => setGlobalFilter(String(value))}
                        className="p-2 bg-transparent outline-none border-b-2 w-1/5 focus:w-1/3 duration-300 border-gray-700 text-gray-900" 
                        placeholder="Search all columns..."
                    />
                </div>
                <Call/>
            </div>
            <table className="w-full text-left shadow">
                <thead className="bg-white">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className="capitalize px-3.5 py-2 text-center">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row,i) => (
                            <tr key={row.id} className={`
                            ${i % 2 === 0 ? 'bg-white bg-opacity-50 ': 'bg-white bg-opacity-80'}
                            `}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-3.5 py-2">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : null}
                </tbody>
                <tfoot className="bg-white">
                    <tr>
                        <th className="capitalize px-3.5 py-2 text-right" colSpan={table.getCenterLeafColumns().length}>
                            <FooterCell table={table} />
                        </th>
                    </tr>
                </tfoot>
            </table>
            {/* <pre>{JSON.stringify(data, null, "\t")}</pre> */}
            <div className="flex justify-end mt-2 gap-2">
                <button
                    onClick={() => {
                        table.previousPage();
                    }}
                    className="p-1 border rounded border-gray-700 px-2 disabled:opacity-30"
                    disabled={!table.getCanPreviousPage()}
                >
                    {"<"}
                </button>
                <button
                    onClick={() => {
                        table.nextPage();
                    }}
                    disabled={!table.getCanNextPage()}
                    className="p-1 border rounded border-gray-700 px-2 disabled:opacity-30"
                >
                    {">"}
                </button>
                <span className="flex items-center gap-1">
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of {" "}
                        {table.getPageCount()}
                    </strong>
                </span>
                <span className="flex items-center gap-1">| Go to page:
                <input 
                    type="number"
                    defaultValue={table.getState().pagination.pageIndex + 1}
                    onChange={(e) => {
                        const page = e.target.value ? Number(e.target.value) - 1 : 0;
                        table.setPageIndex(page);
                    }}
                        className="border-gray-700 p-1 rounded w-16 bg-transparent"
                />
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                    }}
                    className="p-2 bg-transparent border-gray-700"
                >
                    {[10, 20, 30, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    //</QueryClientProvider>
    
    )
}
// const rootElement = document.getElementById('root')

export default Table;