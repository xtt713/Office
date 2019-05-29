using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;

namespace houseMag.OfficeRDisplay.unitMag
{
    /// <summary>
    /// HandlerUnit 的摘要说明
    /// </summary>
    public class HandlerUnit : IHttpHandler
    {

        DBUtility.DbHelperSQL office = new DBUtility.DbHelperSQL("office");
        public void ProcessRequest(HttpContext context)
        {
            if (context.Request["cmd"] != null)
            {
                context.Response.ContentType = "text/plain";
                string cmd = context.Request["cmd"];
                var method = this.GetType().GetMethod(cmd);
                if (method != null)
                {
                    method.Invoke(this, new object[] { context });
                }
                context.Response.End();
            }
        }
        #region 单位详细信息
        public void unitDataTable(HttpContext context)
        {
            string UnitName = context.Request.Params["unitName"];
            string UnitID = context.Request.Params["UnitID"];
            string sql = "SELECT TBU.ID,TBU.UnitName,TBU.address,TBU.ZLandUse,TBU.JLandUse,TBU.area,TBU.info,TBU.shortName from TB_Unit TBU where 1=1";
            if (UnitName == null || UnitName == "")
            {

            }
            else
            {
                sql += " and TBU.UnitName like  '%" + UnitName + "%'";
            }
            if (UnitID == null || UnitID == "")
            {

            }
            else
            {
                sql += " and TBU.ID = '" + UnitID + "'";
            }
            DataTable dt = office.Query(sql).Tables[0];
            StringBuilder mRetSB = new StringBuilder();
            mRetSB.Append("[ ");
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    mRetSB.Append("{ ");
                    foreach (DataColumn column in dt.Columns)
                    {
                        mRetSB.Append("\"" + column.ColumnName + "\":\"" + row[column.ColumnName].ToString() + "\",");
                    }
                    mRetSB.Remove(mRetSB.Length - 1, 1);
                    mRetSB.Append("},");
                }
            }
            mRetSB.Remove(mRetSB.Length - 1, 1);
            mRetSB.Append("]");
            context.Response.Write(mRetSB.ToString());
            context.Response.End();
        }
        #endregion
        #region 测试单位名称是否重复
        public void testUnitName(HttpContext context)
        {
            string oldUnitName = context.Request.Params["oldUnitName"];
            string unitName = context.Request.Params["unitName"];
            string sql = "select UnitName from TB_Unit where UnitName='" + unitName + "' ";
            if (oldUnitName == "" || oldUnitName == null)
            {


            }
            else
            {
                sql += "and UnitName!='" + oldUnitName + "' ";
            }


            DataTable dt = office.Query(sql).Tables[0];
            StringBuilder mRetSB = new StringBuilder();
            mRetSB.Append("[ ");
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    mRetSB.Append("{ ");
                    foreach (DataColumn column in dt.Columns)
                    {
                        mRetSB.Append("\"" + column.ColumnName + "\":\"" + row[column.ColumnName].ToString() + "\",");
                    }
                    mRetSB.Remove(mRetSB.Length - 1, 1);
                    mRetSB.Append("},");
                }
            }
            mRetSB.Remove(mRetSB.Length - 1, 1);
            mRetSB.Append("]");
            context.Response.Write(mRetSB.ToString());
            context.Response.End();
        }
        #endregion
        #region 修改单位信息
        public void editUnitData(HttpContext context)
        {
            string Area = context.Request.Params["Area"];
            string info = context.Request.Params["info"];
            string Address = context.Request.Params["address"];
            string ZLandUse = context.Request.Params["zlanduse"];
            string JLandUse = context.Request.Params["jlanduse"];
            string UnitID = context.Request.Params["UnitID"];
            string UnitName = context.Request.Params["UnitName"];
            string shortName = context.Request.Params["shortName"];
            string str = "";
            string sql = "update TB_Unit SET area='" + Area + "',address='" + Address + "',shortName='" + shortName + "',ZLandUse='" + ZLandUse + "',JLandUse='" + JLandUse + "',info='" + info + "',UnitName='" + UnitName + "' where ID='" + UnitID + "'";
            int count = office.ExecuteSql(sql);
            if (count > 0)
            {
                str = "true";
            }
            else
            {
                str = "false";
            }
            context.Response.Write(str);

        }
        #endregion
        #region 添加单位2018-06-14 WF
        public void addUnitData(HttpContext context)
        {
            string Area = context.Request.Params["Area"];
            string info = context.Request.Params["info"];
            string address = context.Request.Params["address"];
            string ZLandUse = context.Request.Params["zlanduse"];
            string JLandUse = context.Request.Params["jlanduse"];
            string UnitName = context.Request.Params["UnitName"];
            string shortName = context.Request.Params["shortName"];
            string str = "";
            string sql = "insert into TB_Unit(UnitName,address,ZLandUse,JLandUse,area,Info,shortName) values('" + UnitName + "','" + address + "','" + ZLandUse + "','" + JLandUse + "','" + Area + "','" + info + "','" + shortName + "' )";

            if (office.ExecuteSql(sql) > 0)
            {
                str = "true";
            }
            else
            {
                str = "false";
            }
            context.Response.Write(str);
        }
        #endregion
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}