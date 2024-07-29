import { Workbook } from "xlsx-kaku";

import { fDate } from "../utils/formatTime";

export function exportExcel(data) {
  const { title, transactions } = data;

  const wb = new Workbook();
  const ws = wb.addWorksheet("TRANSAKSI");
  ws.setCell(0, 0, { type: "string", value: "DAFTAR TRANSAKSI", style: { alignment: {horizontal: "center", vertical: "center"} } });
  ws.setMergeCell({ ref: "A1:F2" });
  ws.setCell(2, 0, { type: "string", value:  title, style: { alignment: {horizontal: "center", vertical: "center"} } });
  ws.setMergeCell({ ref: "A3:F3" });

  let row = 3
  let currentDate = '';
  let number = 0;
  let income = 0;
  let expense = 0;
  transactions.map((transaction) => {
    if(currentDate !== fDate(transaction.date)) {
      if(row !== 3) {
        row += 1;
        ws.setCell(row, 0, { type: "string", value: "Total" });
        ws.setMergeCell({ ref: `A${row+1}:D${row+1}` })
        ws.setCell(row, 4, { type: "number", value: income, style: { alignment: {horizontal: "right", vertical: "center"} } });
        ws.setCell(row, 5, { type: "number", value: expense, style: { alignment: {horizontal: "right", vertical: "center"} } });
      }
      number = 0;
      income = 0;
      expense = 0;
      row += 3;
      currentDate = fDate(transaction.date);

      ws.setCell(row, 0, { type: "string", value: `${fDate(transaction.date*1)}`, style: { alignment: {horizontal: "center", vertical: "center"} } });
      ws.setMergeCell({ ref: `A${row+1}:F${row+1}` })
      
      row += 1
      ws.setCell(row, 0, { type: "string", value: "#" });
      ws.setCell(row, 1, { type: "string", value: "Label" });
      ws.setCell(row, 2, { type: "string", value: "Akun" });
      ws.setCell(row, 3, { type: "string", value: "Vendor" });
      ws.setCell(row, 4, { type: "string", value: "Income", style: { alignment: {horizontal: "right", vertical: "center"} } });
      ws.setCell(row, 5, { type: "string", value: "Expense", style: { alignment: {horizontal: "right", vertical: "center"} } });
    }
    number += 1;
    row += 1;

    income += transaction.debit;
    expense += transaction.credit;
    
    ws.setCell(row, 0, { type: "number", value: number });
    ws.setCell(row, 1, { type: "string", value: transaction.label });
    ws.setCell(row, 2, { type: "string", value: transaction.accountId?.name || '' });
    ws.setCell(row, 3, { type: "string", value: transaction.vendorId?.name || '' });
    ws.setCell(row, 4, { type: "number", value: transaction.debit, style: { alignment: {horizontal: "right", vertical: "center"} } });
    ws.setCell(row, 5, { type: "number", value: transaction.credit, style: { alignment: {horizontal: "right", vertical: "center"} } });
  })

  row += 1;
  ws.setCell(row, 0, { type: "string", value: "Total" });
  ws.setMergeCell({ ref: `A${row+1}:D${row+1}` })
  ws.setCell(row, 4, { type: "number", value: income, style: { alignment: {horizontal: "right", vertical: "center"} } });
  ws.setCell(row, 5, { type: "number", value: expense, style: { alignment: {horizontal: "right", vertical: "center"} } });

  const xlsx = wb.generateXlsxSync();

  // const blob = new Blob([xlsx], {
  //   type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  // });
  // const url = URL.createObjectURL(blob);
  // const link = document.createElement("a");
  // link.href = url;
  // link.download = `${title}.xlsx`;
  // document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);
  // URL.revokeObjectURL(url);
}