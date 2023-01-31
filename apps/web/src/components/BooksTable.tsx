import { useTable, Column } from 'react-table';

type Props = {
    columns: Array<Column<any>>;
    data: Array<any>;
}

const BooksTable = ({ columns, data }: Props) => {
    const tableInstance = useTable({ columns, data });
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

    return (
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-4 inline-block min-w-full sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                    <table {...getTableProps()} className='min-w-full'>
                        <thead className="border-b bg-gray-100">
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th className="text-sm text-left font-medium text-gray-900 px-6 py-4" {...column.getHeaderProps()}>{column.render('Header')}</th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map(row => {
                                prepareRow(row)
                                return (
                                    <tr {...row.getRowProps()} className="bg-white border-b">
                                        {row.cells.map((cell, index) => {
                                            return <td className='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap' {...cell.getCellProps()}>
                                                {index === 0 ? <a href="/books/review/123" className='cursor-pointer text-blue-600 font-semibold underline'>{cell.render('Cell')}</a> : cell.render('Cell')}
                                            </td>
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default BooksTable