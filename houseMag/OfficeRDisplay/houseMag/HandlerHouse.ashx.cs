using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;


namespace houseMag.OfficeRDisplay.houseMag
{
    /// <summary>
    /// HandlerHouse 的摘要说明
    /// </summary>
    public class HandlerHouse : IHttpHandler
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
        #region 楼房详细信息
        public void houseDataTable(HttpContext context)
        {
            string HouseName = context.Request.Params["houseName"];
            string UnitID = context.Request.Params["UnitID"];
            string HouseID = context.Request.Params["HouseID"];
            string sql = "SELECT TBH.ID,TBH.UnitID,TBU.UnitName,TBH.HouseName,TBH.StartTime,TBH.CompleteTime,TBH.area,TBH.Info from TB_House TBH left join TB_Unit TBU ON TBU.ID=TBH.UnitID where 1=1";
            if (HouseName == null || HouseName == "")
            {

            }
            else
            {
                sql += " and TBH.HouseName like  '%" + HouseName + "%'";
            }
            if (UnitID == null || UnitID == "")
            {

            }
            else
            {
                sql += " and TBH.UnitID =  '" + UnitID + "'";
            }
            if (HouseID == null || HouseID == "")
            {

            }
            else
            {
                sql += " and TBH.ID =  '" + HouseID + "'";
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
        #region 获取单位选项
        public void getUnitOption(HttpContext context)
        {
            string sql = "SELECT ID,UnitName from TB_Unit";

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
        #region 测试单位中楼房名称是否重复
        public void testHouseName(HttpContext context)
        {
            string oldHouseName = context.Request.Params["oldHouseName"];
            string houseName = context.Request.Params["houseName"];
            string UnitID = context.Request.Params["UnitID"];
            string sql = "select HouseName from TB_House where HouseName='" + houseName + "' ";
            if (oldHouseName == "" || oldHouseName == null)
            {


            }
            else
            {
                sql += "and HouseName!='" + oldHouseName + "' ";
            }
            if (UnitID == "" || UnitID == null)
            {

            }
            else
            {
                sql += "and UnitID='" + UnitID + "' ";
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
        #region 修改楼房信息
        public void editHouseData(HttpContext context)
        {
            string Area = context.Request.Params["Area"];
            string info = context.Request.Params["info"];
            string HouseID = context.Request.Params["HouseID"];
            string HouseName = context.Request.Params["HouseName"];
            string startTime = context.Request.Params["startTime"];
            string UnitID = context.Request.Params["UnitID"];
            string completeTime = context.Request.Params["completeTime"];
            string str = "";
            string sql = "update TB_House SET area='" + Area + "',Info='" + info + "',HouseName='" + HouseName + "',StartTime='" + startTime + "',CompleteTime='" + completeTime + "',UnitID='" + UnitID + "' where ID='" + HouseID + "'";
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
        #region 添加楼房2018-06-14 WF
        public void addHouseData(HttpContext context)
        {
            string Area = context.Request.Params["Area"];
            string info = context.Request.Params["info"];
            string HouseID = context.Request.Params["HouseID"];
            string HouseName = context.Request.Params["HouseName"];
            string startTime = context.Request.Params["startTime"];
            string UnitID = context.Request.Params["UnitID"];
            string completeTime = context.Request.Params["completeTime"];
            string str = "";
            string sql = "insert into TB_House(UnitID,HouseName,StartTime,CompleteTime,area,Info) values('" + UnitID + "','" + HouseName + "','" + startTime + "','" + completeTime + "','" + Area + "','" + info + "' )";

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