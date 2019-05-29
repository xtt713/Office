using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
namespace houseMag.OfficeRDisplay.houseSubMag
{
    /// <summary>
    /// HandlerHouseSub 的摘要说明
    /// </summary>
    public class HandlerHouseSub : IHttpHandler
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
        public void housesubDataTable(HttpContext context)
        {

            string HouseSubName = context.Request.Params["housesubName"];
            string UnitID = context.Request.Params["UnitID"];
            string HouseID = context.Request.Params["HouseID"];
            string HouseSubID = context.Request.Params["HouseSubID"];
            string sql = "SELECT TBHS.ID,TBU.UnitName,TBH.HouseName,TBHS.HouseSUBName,TBHS.StartTime,TBHS.CompleteTime,TBHS.area,TBHS.floor from TB_HouserSUB TBHS left join TB_House TBH ON TBH.ID=TBHS.HouseID left join TB_Unit TBU ON TBU.ID=TBH.UnitID where 1=1";
            if (HouseSubName == null || HouseSubName == "")
            {

            }
            else
            {
                sql += " and TBHS.HouseSubName like  '%" + HouseSubName + "%'";
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
                sql += " and TBHS.HouseID =  '" + HouseID + "'";
            }
            if (HouseSubID == null || HouseSubID == "")
            {

            }
            else
            {
                sql += " and TBHS.ID =  '" + HouseSubID + "'";
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
        #region 获取单位中楼房选项
        public void getHouseOption(HttpContext context)
        {
            string unitID = context.Request.Params["unitID"];
            string sql = "SELECT ID,HouseName from TB_House where unitID='" + unitID + "'";

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
        public void testHouseSubName(HttpContext context)
        {
            string oldHouseSubName = context.Request.Params["oldHouseSubName"];
            string housesubName = context.Request.Params["housesubName"];
            string HouseID = context.Request.Params["HouseID"];
            string sql = "select HouseSubName from TB_HouserSUB where HouseSubName='" + housesubName + "' ";
            if (oldHouseSubName == "" || oldHouseSubName == null)
            {


            }
            else
            {
                sql += "and HouseSubName!='" + oldHouseSubName + "' ";
            }
            if (HouseID == "" || HouseID == null)
            {

            }
            else
            {
                sql += "and HouseID='" + HouseID + "' ";
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
        public void editHouseSubData(HttpContext context)
        {
            string Area = context.Request.Params["Area"];
            string floorNo = context.Request.Params["floorNo"];
            string HouseSubID = context.Request.Params["HouseSubID"];
            string HouseSubName = context.Request.Params["HouseSubName"];
            string startTime = context.Request.Params["startTime"];
            string HouseID = context.Request.Params["HouseID"];
            string completeTime = context.Request.Params["completeTime"];
            string str = "";
            string sql = "update TB_HouserSUB SET area='" + Area + "',Info='" + HouseSubName + "',HouseSUBName='" + HouseSubName + "',StartTime='" + startTime + "',CompleteTime='" + completeTime + "',HouseID='" + HouseID + "',floor='" + floorNo + "' where ID='" + HouseSubID + "'";
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
        #region 添加分区2018-06-14 WF
        public void addHouseSubData(HttpContext context)
        {
            string Area = context.Request.Params["Area"];
            string floorNo = context.Request.Params["floorNo"];
            string HouseSubID = context.Request.Params["HouseSubID"];
            string HouseSubName = context.Request.Params["HouseSubName"];
            string startTime = context.Request.Params["startTime"];
            string completeTime = context.Request.Params["completeTime"];
            string HouseID = context.Request.Params["HouseID"];
            string str = "";
            string sql = "insert into TB_HouserSUB(HouseID,HouseSUBName,floor,StartTime,CompleteTime,area,Info) values('" + HouseID + "','" + HouseSubName + "','" + floorNo + "','" + startTime + "','" + completeTime + "','" + Area + "','" + HouseSubName + "' )";

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