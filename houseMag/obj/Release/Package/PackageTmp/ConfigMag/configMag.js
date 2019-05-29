function _configMag() {

}
_configMag.prototype = {
    init: function () {
        $("#applyList>tbody>tr:first-child").addClass("bg-lightblue");
        for (let i = 0; i < parseInt($("#applyList>tbody>tr:first-child").attr("step")) ; i++) {
            $("#applyFlow>ul>li:nth-child(" + (i + 1) + ")").addClass("bg-finish");
        }
        $("#applyList>tbody").find("tr").on('click', function (e) {
            let step = "";
            $("#applyList>tbody").find("tr.bg-lightblue").removeClass("bg-lightblue");
            $("#applyFlow").find(".bg-finish").removeClass("bg-finish");
            if ($(e.target)[0].localName == "tr") {
                $(e.target).addClass("bg-lightblue");
                step = $(e.target).attr("step");
                
            } else {
                $(e.target).parent().addClass("bg-lightblue");
                step = $(e.target).parent().attr("step");
            }
            for (let i = 0; i < step; i++) {
                $("#applyFlow>ul>li:nth-child(" + (i + 1) + ")").addClass("bg-finish");
            }
            
        });

    }
}