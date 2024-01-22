const sreenHeight = window.screen.height;

$(".right-content2").height(sreenHeight - 310);

function getYearBasedOnMonth() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더합니다

  // 1월부터 3월까지는 작년 년도를 반환
  if (currentMonth >= 1 && currentMonth <= 3) {
    return currentYear - 1;
  } else {
    // 4월부터 12월까지는 현재 년도를 반환
    return currentYear;
  }
}

function getCurrentYearMonth() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = (now.getUTCMonth() + 1).toString().padStart(2, "0"); // 월은 0부터 시작하므로 +1 해주고 2자리로 포맷팅

  return year + "-" + month;
}

function getCurrentYearMonth2() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = (now.getUTCMonth() + 1).toString().padStart(2, "0"); // 월은 0부터 시작하므로 +1 해주고 2자리로 포맷팅

  return year + " - " + month;
}

$("#start_ym_ser").val(getYearBasedOnMonth() + "-04");
$("#end_ym_ser").val(getCurrentYearMonth());

$("#start_ym_ser").MonthPicker({
  MonthFormat: "yy-mm",
  ShowIcon: false,
});

$("#end_ym_ser").MonthPicker({
  MonthFormat: "yy-mm",
  ShowIcon: false,
});

$(".ym_ser").on("change", function () {
  var inputValue = $(this).val();

  if (inputValue == "") {
    return;
  }

  // 입력된 값이 6자리이고 숫자인 경우에만 처리합니다.
  if (/^\d{6}$/.test(inputValue)) {
    var formattedValue = inputValue.slice(0, 4) + "-" + inputValue.slice(4, 6);
    $(this).val(formattedValue);
    return;
  }

  if (!/^\d{4}-\d{2}$/.test(inputValue)) {
    $(this).val("");
  }
});

var last_date = new Date();

function refreshScreen() {
  var cur_date = new Date();

  var diff = Math.floor((cur_date - last_date) / 1000);
  var min = Math.floor((300 - diff) / 60);
  var sec = (300 - diff) % 60;
  $("#refresh_time").text(min + ":" + sec.toString().padStart(2, "0"));

  // 년, 월, 일, 요일 정보를 추출합니다.
  var year = last_date.getFullYear();
  var month = last_date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더합니다.
  var day = last_date.getDate();
  var dayOfWeek = last_date.toLocaleDateString("ko-KR", { weekday: "long" });

  // 포맷에 맞게 문자열을 구성합니다.
  var formattedDate =
    "기준일 : " + year + "년 " + month + "월 " + day + "일 (" + dayOfWeek + ")";

  $("#cur_date").text(formattedDate);

  if (diff >= 300) {
    last_date = cur_date;
    callData();
  }
}

setInterval(refreshScreen, 1000);

$("#search").on("click", function () {
  last_date = new Date();
  callData();
});

callData();

function callData() {
  if ($("#LOADYN").val() == "Y") {
    $.isLoading({
      tpl: '<span class="isloading-wrapper %wrapper%"><div class="loadingio-spinner-ellipsis-bus78131cg"><div class="ldio-8a4hfl22cb6"><div></div><div></div><div></div><div></div><div></div></div></div></span>',
    });
  }

  //get data
  var dataPost = {};
  dataPost.type = "get_data";
  dataPost.menucode = "M000000869";
  dataPost.UID = nvl($("#UID").val(), "");
  dataPost.view_yn_ser = $("#view_yn_ser").prop("checked") ? "Y" : "N";

  $.ajax({
    type: "POST",
    url: "/ajax.do",
    dataType: "json",
    data: dataPost,
    success: function (response, status, request) {
      if (status === "success") {
        if (response.status == 200) {
          var cur_ym = getCurrentYearMonth2();

          $("#cur_ym").text(cur_ym);

          todo_list = response.todo_list;
          doc_list = response.doc_list;
          plan_list = response.plan_list;
          sum_list = response.sum_list;

          $(".toto_row").remove();

          for (var i = 0; i < 15; i++) {
            var txt = "";
            if (i >= todo_list.length) {
              txt += `<tr class="toto_row" data-id="0">`;
              txt += `    <td class="al"></td>`;
              txt += `    <td class="ac"></td>`;
              txt += `    <td class="al al_css"></td>`;
              txt += `    <td class="ar"></td>`;
              txt += `</tr>`;
            } else {
              var item = todo_list[i];

              txt += `<tr class="toto_row" data-id="${item.id}">`;
              txt += `    <td class="al">${item.type2}</td>`;
              txt += `    <td class="ac">${item.createdate}</td>`;
              txt += `    <td class="al al_css">${item.title}</td>`;
              txt += `    <td class="ar">${
                item.view_yn == "Y" ? "O" : ""
              }</td>`;
              txt += `</tr>`;
            }

            var tr = $(txt);
            $("#todo").append(tr);
          }

          for (var i = 0; i < 30; i++) {
            if (i >= doc_list.length) {
              $("#invoice_no" + i).text("");
              $("#yag" + i).text("");
              $("#bl" + i).text("");
              $("#customs" + i).text("");
              $("#updatedate" + i).text("");
            } else {
              var item = doc_list[i];

              $("#invoice_no" + i).text(item.invoice_no);
              $("#yag" + i).text(item.yag);
              $("#bl" + i).text(item.bl);
              $("#customs" + i).text(item.customs);
              $("#updatedate" + i).text(item.updatedate);
            }
          }

          for (var i = 0; i < 15; i++) {
            if (i >= plan_list.length) {
              $("#port" + i).text("");
              $("#etd" + i).text("");
              $("#eta" + i).text("");
              $("#book_no" + i).text("");
              $("#vessel" + i).text("");
              $("#voyage" + i).text("");
              $("#origin_20dr" + i).text("");
              $("#final_20dr" + i).text("");
              $("#origin_40hc" + i).text("");
              $("#final_40hc" + i).text("");
              $("#origin_20fr" + i).text("");
              $("#final_20fr" + i).text("");
              $("#origin_40fr" + i).text("");
              $("#final_40fr" + i).text("");
              $("#origin_total" + i).text("");
              $("#final_total" + i).text("");
              $("#emergency" + i).text("");
              $("#user" + i).text("");
              $("#date" + i).text("");
            } else {
              var item = plan_list[i];

              $("#port" + i).text(item.port);
              $("#etd" + i).text(item.etd);
              $("#eta" + i).text(item.eta);
              $("#book_no" + i).text(item.book_no);
              $("#vessel" + i).text(item.vessel);
              $("#voyage" + i).text(item.voyage);
              $("#origin_20dr" + i).text(
                item.origin_20dr == 0 ? "" : item.origin_20dr
              );
              $("#final_20dr" + i).text(
                item.final_20dr == 0 ? "" : item.final_20dr
              );
              $("#origin_40hc" + i).text(
                item.origin_40hc == 0 ? "" : item.origin_40hc
              );
              $("#final_40hc" + i).text(
                item.final_40hc == 0 ? "" : item.final_40hc
              );
              $("#origin_20fr" + i).text(
                item.origin_20fr == 0 ? "" : item.origin_20fr
              );
              $("#final_20fr" + i).text(
                item.final_20fr == 0 ? "" : item.final_20fr
              );
              $("#origin_40fr" + i).text(
                item.origin_40fr == 0 ? "" : item.origin_40fr
              );
              $("#final_40fr" + i).text(
                item.final_40fr == 0 ? "" : item.final_40fr
              );
              $("#origin_total" + i).text(
                item.origin_total == 0 ? "" : item.origin_total
              );
              $("#final_total" + i).text(
                item.final_total == 0 ? "" : item.final_total
              );
              $("#emergency" + i).text(item.emergency);
              $("#user" + i).text(item.user);
              $("#date" + i).text(item.date);
            }
          }

          $("#origin_20dr15").text(
            sum_list[0].origin_20dr == 0 ? "" : sum_list[0].origin_20dr
          );
          $("#final_20dr15").text(
            sum_list[0].final_20dr == 0 ? "" : sum_list[0].final_20dr
          );
          $("#origin_40hc15").text(
            sum_list[0].origin_40hc == 0 ? "" : sum_list[0].origin_40hc
          );
          $("#final_40hc15").text(
            sum_list[0].final_40hc == 0 ? "" : sum_list[0].final_40hc
          );
          $("#origin_20fr15").text(
            sum_list[0].origin_20fr == 0 ? "" : sum_list[0].origin_20fr
          );
          $("#final_20fr15").text(
            sum_list[0].final_20fr == 0 ? "" : sum_list[0].final_20fr
          );
          $("#origin_40fr15").text(
            sum_list[0].origin_40fr == 0 ? "" : sum_list[0].origin_40fr
          );
          $("#final_40fr15").text(
            sum_list[0].final_40fr == 0 ? "" : sum_list[0].final_40fr
          );
          $("#origin_total15").text(
            sum_list[0].origin_total == 0 ? "" : sum_list[0].origin_total
          );
          $("#final_total15").text(
            sum_list[0].final_total == 0 ? "" : sum_list[0].final_total
          );
        }
      }

      if ($("#LOADYN").val() == "Y") {
        $.isLoading("hide");
      }
    },
    error: function (xmlHttpRequest, txtStatus, errorThrown) {
      if ($("#LOADYN").val() == "Y") {
        $.isLoading("hide");
      }
    },
  });
}
