using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;

namespace houseMag.PermissionMag
{
    /// <summary>
    /// HandlerPermission 的摘要说明
    /// </summary>
    public class HandlerPermission : IHttpHandler
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
        #region 侧边栏单位对应大楼
        public void getBuilding(HttpContext context)
        {
            string unitID = context.Request.Params["unitID"];
            string buildingType = context.Request.Params["type"];
            string sql = "select HouseName,ID from TB_House where UnitID='" + unitID + "' and type='" + buildingType + "' order by ID";
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
        #region 侧边栏大楼对应分区
        public void getHouseSub(HttpContext context)
        {
            string unitID = context.Request.Params["unitID"];
            string buildingID = context.Request.Params["buildingID"];
            string sql = "select HouseSUBName,TBHSUB.ID from TB_HouserSUB TBHSUB left join TB_House TBH on TBH.ID=TBHSUB.HouseID where TBH.UnitID='" + unitID + "' and TBHSUB.HouseID='" + buildingID + "' order by TBHSUB.ID";
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
        #region 根据单位，办公楼ID获取相关文件信息
        public void getImgList(HttpContext context)
        {
            string unitID = context.Request.Params["unitID"];
            string buildingID = context.Request.Params["buildingID"];
            string houseSubID = context.Request.Params["houseSubID"];
            string sql = "select TBF.ID,TBF.FileName,TBF.UnitID,TBF.HouseID,TBF.FilePath,TBF.HouseSubID,TBF.FileImg,TBU.UnitName,TBH.HouseName,TBHS.HouseSUBName from TB_File as TBF ";
            sql += "left join TB_Unit as TBU on TBU.ID=TBF.UnitID ";
            sql += "left join TB_House as TBH on TBH.ID=TBF.HouseID ";
            sql += "left join TB_HouserSUB as TBHS on TBHS.ID=TBF.HouseSUBID where TBF.UnitID='" + unitID + "' ";
            if (buildingID == null || buildingID == "") { }
            else
            {
                sql += "and TBF.HouseID='" + buildingID + "' ";
            }
            if (houseSubID == null || houseSubID == "")
            {

            }
            else
            {
                sql += "and TBF.HouseSubID='" + houseSubID + "'";
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

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}