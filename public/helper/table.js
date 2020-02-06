class Button {
  constructor(type, btnText, onClick, btnData) {
    this.element = $("<button>");
    this.element.attr("class", type);
    this.element.html(btnText);
    this.element.click( () =>{
      onClick(btnData);
    });
  }
}

class Table {
  constructor(table, columns, data, rowIDS) {
    this.table = table;
    this.columns = columns;
    this.data = data;
    this.rowIDS = rowIDS;
  }

  BuildTableTest() {
    const tableHead = $("<thead>");
    const tableHeadRow = $("<tr>");
    const tableBody = $("<tbody>");

    tableBody.attr("class", "table");

    this.table.append(tableHead);
    tableHead.append(tableHeadRow);
    this.table.append(tableBody);

    this.columns.forEach(coll => {
      const th = $("<th>");
      th.attr("scope", "col");
      th.html(coll);
      tableHead.append(th);
    });

    this.data.forEach(item => {
      tableBody.append(this.BuildRow(item));
    });
  }

  BuildRow(item) {
    const tRow = $("<tr>");
    if(this.rowIDS){
      tRow.attr("id", this.rowIDS.shift());
    }
    const values = Object.values(item);

    values.forEach(coll => {
      const rowData = $("<td>");''
      if (typeof coll != "string") {
        tRow.append($("<td>").append(coll.element));
      }else{
        tRow.append($("<td>").html(coll));
      }
    });
    
    return tRow;
  }
}