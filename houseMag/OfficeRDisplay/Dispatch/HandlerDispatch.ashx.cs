using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;

namespace houseMag.OfficeRDisplay.Dispatch
{
    /// <summary>
    /// HandlerDispatch 的摘要说明
    /// </summary>
    public class HandlerDispatch : IHttpHandler
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
        public void CountPerson(HttpContext context)
        {

            string roomID = context.Request.Params["roomID"];

            string sql = "select count(*) as countPerson from TB_Person where RoomID='" + roomID + "'";
            DataTable dt = office.QueryDataTable(sql);
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

        public void changSort(HttpContext context)
        {
            string roomID = context.Request.Params["roomID"];
            string sql = "update TB_Room set sort=99999 where ID = " + roomID;
            int n = office.ExecuteSql(sql);
            context.Response.Write(n);
            context.Response.End();
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}