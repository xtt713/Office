using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;

namespace houseMag.Svr
{
    /// <summary>
    /// HandlerOffice 的摘要说明
    /// </summary>
    public class HandlerOffice : IHttpHandler
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

        #region 登录页面
        public void Office(HttpContext context)
        {
            string userName = context.Request.Params["userName"];
            string password = context.Request.Params["password"];
            string sql = "select * from TB_Person where userName collate Chinese_PRC_CS_AS = '" + userName + "' and password collate Chinese_PRC_CS_AS = '" + password + "' and state='1'";
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
        #endregion
        #region 模糊搜索，根据输入字符自动匹配所需要的值
        public void searchName(HttpContext context)
        {
            string txt = context.Request.Params["txt"];
            string sql = "SELECT UNITNAME FROM TB_UNIT WHERE UNITNAME LIKE '%" + txt + "%'";
            DataTable dt = office.Query(sql).Tables[0];
            StringBuilder mRetSB = new StringBuilder();
            mRetSB.Append("[");
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
        #region 获取单位信息
        public void getUnitName(HttpContext context)
        {
            string txtSearch = context.Request.Params["txtSearch"];
            string sql = "SELECT  TBU.info,TBU.ID,TBU.UnitName,TBU.shortName,TBI.ImgPath,TBU.address,TBU.LGTD,TBU.LTTD from TB_Unit TBU left join(select * from TB_Image where Type='1') TBI ON TBU.ID=TBI.SID ";
            if (txtSearch == null || txtSearch == "")
            {

            }
            else
            {
                sql += " where TBU.UnitName like '%" + txtSearch + "%'";
            }

            DataTable dt = office.Query(sql).Tables[0];
            StringBuilder mRetSB = new StringBuilder();
            mRetSB.Append("[");
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
        #region 获取省政府全部信息
        public void getGovData(HttpContext context)
        {
            string UnitID = context.Request.Params["UnitID"];
            string sql = "SELECT ImgPath from TB_Image where SID ='" + UnitID + "'and Type='1'";
            DataTable dt = office.Query(sql).Tables[0];
            string sql1 = "select UnitName,Info from TB_Unit where ID='" + UnitID + "'";
            DataTable dt1 = office.Query(sql1).Tables[0];
            StringBuilder mRetSB = new StringBuilder();
            mRetSB.Append("[{\"imgPath\":[  ");
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
            mRetSB.Append("],\"unitName\":[");
            if (dt1.Rows.Count > 0)
            {
                foreach (DataRow row in dt1.Rows)
                {
                    mRetSB.Append("{ ");
                    foreach (DataColumn column in dt1.Columns)
                    {
                        mRetSB.Append("\"" + column.ColumnName + "\":\"" + row[column.ColumnName].ToString() + "\",");
                    }
                    mRetSB.Remove(mRetSB.Length - 1, 1);
                    mRetSB.Append("},");
                }
            }
            mRetSB.Remove(mRetSB.Length - 1, 1);
            mRetSB.Append("]}]");
            context.Response.Write(mRetSB.ToString());
            context.Response.End();
        }
        #endregion
        #region 获取省政府所有大楼和其它(食堂，武警房，信访接待室，人民会堂)的名称和面积
        public void getHouseArea(HttpContext context)
        {
            string unitID = context.Request.Params["unitID"];
            string sql = "SELECT HouseName,type,area FROM TB_House where UnitID='" + unitID + "'";
            DataTable dt = office.Query(sql).Tables[0];

            StringBuilder mRetSB = new StringBuilder();
            mRetSB.Append("[");
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
        #region 获取大楼信息
        public void getHouseName(HttpContext context)
        {
            string unitID = context.Request.Params["unitID"];
            string houseType = context.Request.Params["type"];
            string sql = "SELECT ID,HouseName from TB_House where UnitID='" + unitID + "' and type='" + houseType + "'";
            DataTable dt = office.Query(sql).Tables[0];
            StringBuilder mRetSB = new StringBuilder();
            mRetSB.Append("[");
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
            if (dt.Rows.Count == 0)
            {
                mRetSB.Append(",");
            }
            mRetSB.Remove(mRetSB.Length - 1, 1);
            mRetSB.Append("]");
            context.Response.Write(mRetSB.ToString());
            context.Response.End();
        }
        #endregion
        #region 获取颜色信息
        public void getColor(HttpContext context)
        {
            string top = context.Request.Params["top"];
            string sql = "SELECT TOP " + top + " Color,ColorName from TB_Style";
            DataTable dt = office.Query(sql).Tables[0];
            StringBuilder mRetSB = new StringBuilder();
            mRetSB.Append("[");
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
            if (dt.Rows.Count == 0)
            {
                mRetSB.Append("]");
            }
            mRetSB.Remove(mRetSB.Length - 1, 1);
            mRetSB.Append("]");
            context.Response.Write(mRetSB.ToString());
            context.Response.End();
        }
        #endregion
        #region 根据单位ID获取大楼路径
        public void getHousePath(HttpContext context)
        {
            string unitID = context.Request.Params["unitID"];
            string sql = " select * from HousePosition where UnitID='" + unitID + "' ";

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
        #region 根据楼房ID获取楼层信息
        public void getFloorData(HttpContext context)
        {
            string houseId = context.Request.Params["houseId"];
            string sql = " select TBHS.Floor,TBH.HouseName from TB_HouserSub TBHS left join TB_House TBH on TBH.ID=TBHS.HouseID  where HouseID='" + houseId + "' ";
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
        #region 根据楼房ID,楼层获取房间path和边界path
        public void getRoomPath(HttpContext context)
        {
            string houseId = context.Request.Params["houseId"];
            string floor = context.Request.Params["floor"];
            string sql1 = " select * from FrameInfo where HouseID='" + houseId + "' and floor='" + floor + "' ";
            string sql2 = " SELECT DISTINCT TBP.DivisionID, TBR.ID, TBD.DivisionName,TBR.RoomName,TBR.BoundaryPosition,TBR.textPosition FROM dbo.TB_Room AS TBR LEFT OUTER JOIN dbo.TB_Person AS TBP ON TBR.ID = TBP.RoomID LEFT OUTER JOIN dbo.TB_Division AS TBD ON TBD.ID = TBP.DivisionID  where HouseID='" + houseId + "' and floorno='" + floor + "'";

            //string sql3 = "select * from TB_TBBuild_Style";
            DataTable dt = office.Query(sql1).Tables[0];
            DataTable dt1 = office.Query(sql2).Tables[0];
            StringBuilder mRetSB = new StringBuilder();
            mRetSB.Append("{\"frameInfo\":[");
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
            mRetSB.Append("],\"roomPath\":[");
            if (dt1.Rows.Count > 0)
            {
                foreach (DataRow row in dt1.Rows)
                {
                    mRetSB.Append("{ ");
                    foreach (DataColumn column in dt1.Columns)
                    {
                        mRetSB.Append("\"" + column.ColumnName + "\":\"" + row[column.ColumnName].ToString() + "\",");
                    }
                    mRetSB.Remove(mRetSB.Length - 1, 1);
                    mRetSB.Append("},");
                }
            }
            mRetSB.Remove(mRetSB.Length - 1, 1);
            mRetSB.Append("]}");
            context.Response.Write(mRetSB.ToString());
            context.Response.End();
        }
        #endregion

        #region 获取左上角房间状态饼状图
        public void getPieChartHouse(HttpContext context)
        {
            string buildingID = context.Request.Params["buildingID"];
            string roomType = context.Request.Params["roomType"];
            string sql = "select distinct TBR.ID as RoomID,TBR.Area,TBB.barea from TB_Room as TBR ";
            sql += "left join (SELECT b.RoomID, SUM(c.Area) AS barea FROM  dbo.TB_Person AS b INNER JOIN dbo.TB_Title AS c ON b.TitleID = c.ID where b.state='1' and b.RoomID is not null and b.RoomID!='0' GROUP BY b.RoomID) as TBB on TBR.ID=TBB.RoomID ";
            sql += "left join TB_Person as TBP ON TBP.RoomID = TBR.ID where TBR.HouseID = '" + buildingID + "' and TBR.RoomType='1' ";
            if (roomType != "" || roomType != null)
            {
                sql += "and TBR.FloorNo='" + roomType + "' ";
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

        #region
        public void getBuildColor(HttpContext context)
        {
            string top = context.Request.Params["top"];
            string sql = "SELECT TOP " + top + " Color,ColorName,class from TBBuild_Style";
            DataTable dt = office.Query(sql).Tables[0];
            StringBuilder mRetSB = new StringBuilder();
            mRetSB.Append("[");
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
            if (dt.Rows.Count == 0)
            {
                mRetSB.Append("]");
            }
            mRetSB.Remove(mRetSB.Length - 1, 1);
            mRetSB.Append("]");
            context.Response.Write(mRetSB.ToString());
            context.Response.End();
        }
        #endregion

        #region 获取省政府某栋大楼信息
        public void getBuildingInfo(HttpContext context)
        {

            string buildingID = context.Request.Params["buildingID"];
            string sql = "SELECT HouseName,Info from TB_House where ID=" + buildingID;
            DataTable dt = office.Query(sql).Tables[0];

            StringBuilder mRetSB = new StringBuilder();
            mRetSB.Append("[");
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
        #region 获取省政府某栋大楼图片
        public void getBuildingImg(HttpContext context)
        {
            string buildingID = context.Request.Params["buildingID"];
            string sql = "SELECT TBI.ImgPath from TB_House as TBH left join TB_Image as TBI on TBI.SID=TBH.ID where TBI.Type='2' and SID=" + buildingID;
            DataTable dt = office.Query(sql).Tables[0];

            StringBuilder mRetSB = new StringBuilder();
            mRetSB.Append("[");
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
            if (dt.Rows.Count == 0)
            {
                mRetSB.Append(",");
            }
            mRetSB.Remove(mRetSB.Length - 1, 1);
            mRetSB.Append("]");
            context.Response.Write(mRetSB.ToString());
            context.Response.End();
        }
        #endregion
        #region 办公室级别使用统计
        public void OfficeUsing(HttpContext context)
        {
            string sql = "select TitleName,Area from TB_Title";
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

        #region 根据楼房ID,楼层获取房间path和边界path
        public void getOfficeRoomHouse(HttpContext context)
        {
            string houseId = context.Request.Params["buildingId"];
            string floor = context.Request.Params["roomType"];
            string rName = context.Request.Params["rName"];
            string sql2 = " select distinct TBR.ID as RoomID,TBR.RoomName,TBR.Area,TBB.barea from TB_Room as TBR left join (SELECT b.RoomID, SUM(c.Area) AS barea FROM  dbo.TB_Person AS b INNER JOIN dbo.TB_Title AS c ON b.TitleID = c.ID where b.state='1' and b.RoomID is not null and b.RoomID!='0' GROUP BY b.RoomID) as TBB on TBR.ID=TBB.RoomID left join TB_Person as TBP ON TBP.RoomID = TBR.ID where TBR.RoomType='1' and HouseID='" + houseId + "' and floorno='" + floor + "'";
            if (rName == "达标")
            {
                sql2 += " and TBR.Area<=TBB.barea";
            }
            else if (rName == "超标")
            {
                sql2 += " and TBR.Area>=TBB.barea";
            }
            DataTable dt1 = office.Query(sql2).Tables[0];
            StringBuilder mRetSB = new StringBuilder();
            mRetSB.Append("[ ");
            if (dt1.Rows.Count > 0)
            {
                foreach (DataRow row in dt1.Rows)
                {
                    if (rName == "空置" && row["barea"].ToString() == "")
                    {
                        mRetSB.Append("{ ");
                        foreach (DataColumn column in dt1.Columns)
                        {
                            mRetSB.Append("\"" + column.ColumnName + "\":\"" + row[column.ColumnName].ToString() + "\",");
                        }
                        mRetSB.Remove(mRetSB.Length - 1, 1);
                        mRetSB.Append("},");
                    }
                    else
                    {
                        if (rName == "达标" || rName == "超标")
                        {
                            mRetSB.Append("{ ");
                            foreach (DataColumn column in dt1.Columns)
                            {
                                mRetSB.Append("\"" + column.ColumnName + "\":\"" + row[column.ColumnName].ToString() + "\",");
                            }
                            mRetSB.Remove(mRetSB.Length - 1, 1);
                            mRetSB.Append("},");
                        }
                    }
                }
            }
            mRetSB.Remove(mRetSB.Length - 1, 1);
            mRetSB.Append("]");
            context.Response.Write(mRetSB.ToString());
            context.Response.End();
        }
        #endregion

        #region 根据房间ID获取某个房间的所有信息
        public void getRRoomData(HttpContext context)
        {
            string roomID = context.Request.Params["roomID"];
            string sql = " SELECT DISTINCT TBR.ID AS RoomID, TBR.Area, TBB.barea, b_1.DivisionName,TBR.RoomName, TBR.Users FROM dbo.TB_Room AS TBR LEFT OUTER JOIN (SELECT b.RoomID, SUM(c.Area) AS barea FROM     dbo.TB_Person AS b INNER JOIN dbo.TB_Title AS c ON b.TitleID = c.ID WHERE (b.State = '1') AND (b.RoomID IS NOT NULL) AND (b.RoomID <> '0')  GROUP BY b.RoomID) AS TBB ON TBR.ID = TBB.RoomID LEFT OUTER JOIN (SELECT DISTINCT TBP.DivisionID, TBR.ID, TBD.DivisionName FROM  dbo.TB_Room AS TBR LEFT OUTER JOIN dbo.TB_Person AS TBP ON TBR.ID = TBP.RoomID LEFT OUTER JOIN dbo.TB_Division AS TBD ON TBD.ID = TBP.DivisionID WHERE (TBR.IfShow = '1')) AS b_1 ON TBR.ID = b_1.ID  where TBR.ID='" + roomID + "' ";
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


        #region 楼房详细信息
        public void getBuildingData(HttpContext context)
        {
            //status为房间状态，TitleID为职称
            string UnitId = context.Request.Params["UnitID"];
            string buildingId = context.Request.Params["buildingId"];
            string status = context.Request.Params["status"];
            string TitleID = context.Request.Params["TitleID"];
            string scale = context.Request.Params["scale"];
            string sql = "SELECT s.ID,y.info,x.Type, s.RoomName, s.Area,z.DivisionName, t.RoomID,t.barea,TBP.DivisionID,TBP.PName,TBH.HouseName,TBI.ImgPath,TBI.Type as ImgType,s.sort FROM dbo.TB_Room AS s ";
            sql += "LEFT OUTER JOIN(SELECT b.RoomID, SUM(c.Area) AS barea FROM  dbo.TB_Person AS b INNER JOIN dbo.TB_Title AS c ON b.TitleID = c.ID GROUP BY b.RoomID ) AS t ON s.ID = t.RoomID ";
            sql += "left join dbo.TB_RType as x on s.RoomType=x.ID ";
            sql += "left join TB_HouserSUB as y on s.HouseSUBID=y.ID LEFT join TB_Person as TBP on TBP.RoomID = s.ID ";
            sql += "left join TB_Image as TBI on TBI.SID = s.ID ";
            sql += "left join TB_Division as z on z.ID = TBP.DivisionID left join TB_House as TBH on TBH.ID=s.HouseID where  s.UnitID='" + UnitId + "' and s.ID=TBI.SID ";
            if (buildingId == "" || buildingId == null)
            {
                sql += "";
            }
            else
            {
                sql += "and s.HouseID='" + buildingId + "' ";
            }

            if (TitleID == "" || TitleID == null)
            {
                sql += "";
            }
            else
            {

                switch (TitleID)
                {
                    case "1":
                    case "2":
                        sql += "and (TBP.TitleID='1' or TBP.TitleID='2') ";
                        break;
                    case "3":
                    case "4":
                        sql += "and (TBP.TitleID='3' or TBP.TitleID='4') ";
                        break;
                    default:
                        sql += "and TBP.TitleID='" + TitleID + "' ";
                        break;
                }
            }

            if (status == null || status == "")
            {

            }
            else if (status == "0")
            {
                sql += "and s.Area>" + scale + "*barea ";
            }
            else if (status == "1")
            {
                sql += "and s.Area<=" + scale + "*barea ";
            }
            else if (status == "2")
            {
                sql += "and barea is null ";
            }
            sql += "order by s.ID";
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

        #region 获取左上角房间状态饼状图
        public void getPieChart(HttpContext context)
        {
            string buildingID = context.Request.Params["buildingID"];
            string houseSubID = context.Request.Params["houseSubID"];
            string floor = context.Request.Params["floor"];
            string divisionID = context.Request.Params["divisionID"];
            string PName = context.Request.Params["PName"];
            string titleID = context.Request.Params["titleID"];
            string roomType = context.Request.Params["roomType"];
            string sql = "select distinct TBR.ID as RoomID,TBR.Area,TBB.barea from TB_Room as TBR ";
            sql += "left join (SELECT b.RoomID, SUM(c.Area) AS barea FROM  dbo.TB_Person AS b INNER JOIN dbo.TB_Title AS c ON b.TitleID = c.ID where b.state='1' and b.RoomID is not null and b.RoomID!='0' GROUP BY b.RoomID) as TBB on TBR.ID=TBB.RoomID ";
            sql += "left join TB_Person as TBP ON TBP.RoomID = TBR.ID where TBR.HouseID = '" + buildingID + "' ";
            if (roomType == "" || roomType == null)
            {
                sql += "and TBR.RoomType='1' ";
            }
            else
            {
                sql += "and TBR.RoomType='" + roomType + "' ";
            }
            if (houseSubID == null || houseSubID == "")
            {

            }
            else
            {
                sql += "and TBR.HouseSUBID='" + houseSubID + "' ";
            }
            if (floor == null || floor == "")
            {

            }
            else
            {
                sql += "and TBR.FloorNo='" + floor + "' ";
            }
            if (divisionID == null || divisionID == "")
            {

            }
            else
            {
                sql += "and TBP.DivisionID='" + divisionID + "' ";
            }
            if (PName == null || PName == "")
            {

            }
            else
            {
                sql += "and TBP.PName like'%" + PName + "%' ";
            }
            if (titleID == null || titleID == "")
            {

            }
            else
            {
                switch (titleID)
                {
                    case "1":
                    case "2":
                        sql += "and TBP.TitleID='1' or TBP.TitleID='2' ";
                        break;
                    case "3":
                    case "4":
                        sql += "and TBP.TitleID='3' or TBP.TitleID='4' ";
                        break;
                    default:
                        sql += "and TBP.TitleID='" + titleID + "'";
                        break;
                }

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

        #region 政府办公楼办公人员职称分布情况 柱状图形统计
        public void personSpreadHouse(HttpContext context)
        {
            string buildingId = context.Request.Params["buildingId"];
            string roomType = context.Request.Params["roomType"];
            string sql = "select TBT.TitleName,Count(TBT.TitleName) as num,max(TBT.ID) as ID from TB_Person as TBP ";
            sql += "left join TB_Room as TBR on TBP.RoomID=TBR.ID ";
            sql += "left join (SELECT b.RoomID, SUM(c.Area) AS barea FROM  dbo.TB_Person AS b INNER JOIN dbo.TB_Title AS c ON b.TitleID = c.ID where b.state='1' and b.RoomID is not null and b.RoomID!='0' GROUP BY b.RoomID) as TBB on TBB.RoomID=TBP.RoomID ";
            sql += "left join TB_Title as TBT on TBT.ID=TBP.TitleID  where TBR.HouseID='" + buildingId + "' and floorno= "+roomType;   
            sql += " group by TBT.TitleName";

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

        #region 获取办公人员职称分布情况（图形点击方法）显示房间
        public void getOfficeRoomHouseClick(HttpContext context)
        {
            string titleId = context.Request.Params["titleId"];
            string houseId = context.Request.Params["buildingId"];
            string roomType = context.Request.Params["roomType"];
            string sql = "select R.ID from TB_Room as R left join TB_Person as P on r.ID=p.RoomID where p.TitleID='" + titleId + "' and HouseID='" + houseId + "' and RoomType='1' and FloorNo='" + roomType + "' and R.Users is not null AND R.Users <> '' group by R.ID ";
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

        #region （办公室分类统计）柱状图
        public void getRoomNumHouse(HttpContext context)
        {
            string buildingID = context.Request.Params["buildingID"];
            string floor = context.Request.Params["floor"];

            string sql = "SELECT distinct TBR.ID,TBR.RoomType,TBRT.Type,TBR.Area, TBB.barea FROM dbo.TB_Room AS TBR ";
            sql += "left join (SELECT b.RoomID, SUM(c.Area) AS barea FROM  dbo.TB_Person AS b INNER JOIN dbo.TB_Title AS c ON b.TitleID = c.ID where b.state='1' and b.RoomID is not null and b.RoomID!='0'  GROUP BY b.RoomID) as TBB on TBR.ID=TBB.RoomID ";
            sql += "left join TB_House as TBH ON TBH.ID=TBR.HouseID ";
            sql += "left join dbo.TB_RType as TBRT on TBR.RoomType=TBRT.ID ";
            sql += "left join TB_HouserSUB as TBHS on TBR.HouseSUBID=TBHS.ID ";
            sql += "left join TB_Person as TBP on TBP.RoomID = TBR.ID ";
            sql += "left join TB_Division as TBD on TBD.ID = TBP.DivisionID where TBR.HouseID='" + buildingID + "' ";

            if (floor == "" || floor == null)
            {

            }
            else
            {
                sql += "and TBR.FloorNo='" + floor + "' ";
            }
            //string sql = "select imgPath from TB_Image  where  Type=5";
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


        #region （办公室分类统计）柱状图 （点击图标改变对应的房间背景）
        public void getRoomTypeClick(HttpContext context)
        {
            string houseId = context.Request.Params["houseId"];
            string floor = context.Request.Params["floor"];
            string roomTypeId = context.Request.Params["roomTypeId"];
            string sql = "SELECT distinct TBR.ID,TBR.RoomType,TBR.RoomName,TBB.barea FROM dbo.TB_Room AS TBR ";
            sql += "left join (SELECT b.RoomID, SUM(c.Area) AS barea FROM  dbo.TB_Person AS b INNER JOIN dbo.TB_Title AS c ON b.TitleID = c.ID where b.state='1' and b.RoomID is not null and b.RoomID!='0'  GROUP BY b.RoomID) as TBB on TBR.ID=TBB.RoomID ";
            sql += "left join TB_House as TBH ON TBH.ID=TBR.HouseID ";
            sql += "left join dbo.TB_RType as TBRT on TBR.RoomType=TBRT.ID ";
            sql += "left join TB_HouserSUB as TBHS on TBR.HouseSUBID=TBHS.ID ";
            sql += "left join TB_Person as TBP on TBP.RoomID = TBR.ID ";
            sql += "left join TB_Division as TBD on TBD.ID = TBP.DivisionID  where TBB.barea is not null AND TBB.barea <> '' and TBR.HouseID='" + houseId + "' ";
            if (floor.Equals("") || floor == null)
            {

            }
            else
            {
                sql += "and TBR.FloorNo='" + floor + "' ";
            }
            if (!roomTypeId.Equals("") || roomTypeId != null)
            {
                sql += "and RoomType='" + roomTypeId + "' ";
            }
            //string sql = "select imgPath from TB_Image  where  Type=5";
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

        #region 获取办公用房类型;
        public void getRoomType(HttpContext context)
        {
            //houseType为1表示办公室类型，为0表示其他（门面和公有用房）
            string houseType = context.Request.Params["houseType"];

            string sql = "select ID,Type from TB_RType where houseType=" + houseType;
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

        #region 获取处室分布情况（图形点击方法）显示房间
        public void getColumnChartmHouseClick(HttpContext context)
        {
            string divName = context.Request.Params["divName"];   //处室名称
            string houseId = context.Request.Params["buildingId"];
            string roomType = context.Request.Params["roomType"];
            string sqlDiv = " select ID from dbo.TB_Division where DivisionName='" + divName + "'";
            DataTable dtDiv = office.Query(sqlDiv).Tables[0];
            string divID = "";
            if (dtDiv.Rows.Count > 0)
            {
                divID = dtDiv.Rows[0]["ID"].ToString();
            }
            string sql = "select R.RoomName from TB_Room as R left join TB_Person as P on r.ID=p.RoomID where p.DivisionID='" + divID + "' and HouseID='" + houseId + "' and RoomType='1' and FloorNo='" + roomType + "' and R.Users is not null AND R.Users <> '' group by R.RoomName ";
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

        #region 处室人员统计;
        public void getDivPerson(HttpContext context)
        {
            string roomID = context.Request.Params["roomID"];

            string sql = "select d.DivisionName,COUNT(*) as Total  from TB_Division as d left join TB_Person as p on d.ID=p.DivisionID where(select COUNT(*) from TB_Division as d left join TB_Person as p on d.ID=p.DivisionID) >0 and  p.RoomID in (" + roomID + ")group by d.DivisionName";
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


        #region 获取条件内所有房间信息
        public void getRoomData(HttpContext context)
        {
            string buildingID = context.Request.Params["buildingID"];
            string houseSubID = context.Request.Params["houseSubID"];
            string floor = context.Request.Params["floor"];
            string divisionID = context.Request.Params["divisionID"];
            string PName = context.Request.Params["PName"];
            string titleID = context.Request.Params["titleID"];
            string state = context.Request.Params["state"];
            string scale = context.Request.Params["scale"];
            string roomType = context.Request.Params["roomType"];
            string sql = "SELECT distinct TBR.ID,TBRT.Type, TBR.RoomName,TBI.ImgPath, TBR.Area, TBB.barea,TBH.HouseName,TBR.sort,TBHS.HouseSUBName,TBI.Type as ImgType,TBR.RoomType FROM dbo.TB_Room AS TBR ";
            sql += "left join (SELECT b.RoomID, SUM(c.Area) AS barea FROM  dbo.TB_Person AS b INNER JOIN dbo.TB_Title AS c ON b.TitleID = c.ID where b.state='1' and b.RoomID is not null and b.RoomID!='0'  GROUP BY b.RoomID) as TBB on TBR.ID=TBB.RoomID ";
            sql += "left join TB_House as TBH ON TBH.ID=TBR.HouseID ";
            sql += "left join dbo.TB_RType as TBRT on TBR.RoomType=TBRT.ID ";
            sql += "left join TB_HouserSUB as TBHS on TBR.HouseSUBID=TBHS.ID ";
            sql += "left join TB_Person as TBP on TBP.RoomID = TBR.ID ";
            sql += "left join TB_Image as TBI on TBI.SID=TBR.ID ";
            sql += "left join TB_Division as TBD on TBD.ID = TBP.DivisionID where TBR.HouseID='" + buildingID + "' ";
            if (roomType == "" || roomType == null)
            {
                sql += "and TBR.RoomType='1' ";
            }
            else
            {
                sql += "and TBR.RoomType='" + roomType + "' ";
            }
            if (houseSubID == "" || houseSubID == null)
            {

            }
            else
            {
                sql += "and TBR.HouseSubID='" + houseSubID + "' ";
            }
            if (floor == "" || floor == null)
            {

            }
            else
            {
                sql += "and TBR.FloorNo='" + floor + "' ";
            }
            if (divisionID == "" || divisionID == null)
            {

            }
            else
            {
                sql += "and TBP.DivisionID='" + divisionID + "' ";
            }
            if (PName == "" || PName == null)
            {

            }
            else
            {
                sql += "and TBP.PName like'%" + PName + "%' ";
            }
            if (titleID == null || titleID == "")
            {

            }
            else
            {
                switch (titleID)
                {
                    case "1":
                    case "2":
                        sql += "and (TBP.TitleID='1' or TBP.TitleID='2') ";
                        break;
                    case "3":
                    case "4":
                        sql += "and (TBP.TitleID='3' or TBP.TitleID='4') ";
                        break;
                    default:
                        sql += "and (TBP.TitleID='" + titleID + "')";
                        break;
                }
            }
            if (state == null || state == "")
            {

            }
            else
            {
                switch (state)
                {
                    case "0":
                        sql += "and TBR.Area>" + scale + "*TBB.barea ";
                        break;
                    case "1":
                        sql += "and TBR.Area<=" + scale + "*TBB.barea ";
                        break;
                    case "2":
                        sql += "and TBB.barea is null ";
                        break;
                }
            }
            sql += "order by TBR.sort";
            //string sql = "select imgPath from TB_Image  where  Type=5";
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
        #region 获取条件内所有房间信息
        public void getRoomNum(HttpContext context)
        {
            string buildingID = context.Request.Params["buildingID"];
            string houseSubID = context.Request.Params["houseSubID"];
            string floor = context.Request.Params["floor"];
            string divisionID = context.Request.Params["divisionID"];
            string PName = context.Request.Params["PName"];
            string titleID = context.Request.Params["titleID"];
            string state = context.Request.Params["state"];
            string scale = context.Request.Params["scale"];
            string sql = "SELECT distinct TBR.ID,TBR.RoomType,TBRT.Type,TBR.Area, TBB.barea FROM dbo.TB_Room AS TBR ";
            sql += "left join (SELECT b.RoomID, SUM(c.Area) AS barea FROM  dbo.TB_Person AS b INNER JOIN dbo.TB_Title AS c ON b.TitleID = c.ID where b.state='1' and b.RoomID is not null and b.RoomID!='0'  GROUP BY b.RoomID) as TBB on TBR.ID=TBB.RoomID ";
            sql += "left join TB_House as TBH ON TBH.ID=TBR.HouseID ";
            sql += "left join dbo.TB_RType as TBRT on TBR.RoomType=TBRT.ID ";
            sql += "left join TB_HouserSUB as TBHS on TBR.HouseSUBID=TBHS.ID ";
            sql += "left join TB_Person as TBP on TBP.RoomID = TBR.ID ";
            sql += "left join TB_Division as TBD on TBD.ID = TBP.DivisionID where TBR.HouseID='" + buildingID + "' ";
            if (houseSubID == "" || houseSubID == null)
            {

            }
            else
            {
                sql += "and TBR.HouseSubID='" + houseSubID + "' ";
            }
            if (floor == "" || floor == null)
            {

            }
            else
            {
                sql += "and TBR.FloorNo='" + floor + "' ";
            }
            if (divisionID == "" || divisionID == null)
            {

            }
            else
            {
                sql += "and TBP.DivisionID='" + divisionID + "' ";
            }
            if (PName == "" || PName == null)
            {

            }
            else
            {
                sql += "and TBP.PName like'%" + PName + "%' ";
            }
            if (titleID == null || titleID == "")
            {

            }
            else
            {
                switch (titleID)
                {
                    case "1":
                    case "2":
                        sql += "and (TBP.TitleID='1' or TBP.TitleID='2') ";
                        break;
                    case "3":
                    case "4":
                        sql += "and (TBP.TitleID='3' or TBP.TitleID='4') ";
                        break;
                    default:
                        sql += "and (TBP.TitleID='" + titleID + "')";
                        break;
                }
            }
            if (state == null || state == "")
            {

            }
            else
            {
                switch (state)
                {
                    case "0":
                        sql += "and TBR.Area>" + scale + "*TBB.barea ";
                        break;
                    case "1":
                        sql += "and TBR.Area<=" + scale + "*TBB.barea ";
                        break;
                    case "2":
                        sql += "and TBB.barea is null ";
                        break;
                }
            }
            //string sql = "select imgPath from TB_Image  where  Type=5";
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
        #region 获取某个房间的人员信息
        public void getPNameDivision(HttpContext context)
        {
            string roomID = context.Request.Params["roomID"];
            string sql = "select a.PName, b.TitleName from TB_Person a, TB_Title b  where a.RoomID = " + roomID + " and a.TitleID = b.id order by convert(int,a.PPhone)";

            DataTable dt = office.Query(sql).Tables[0];
            if (dt.Rows.Count == 0)
            {
                sql = "select a.users as PName , b.type as TitleName from TB_room a, TB_RType b  where a.ID = " + roomID + " and a.RoomType = b.id";
                dt = office.Query(sql).Tables[0];
            }
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
        #region 根据房间号获取房间内人员姓名
        public void getRoomPerson(HttpContext context)
        {
            string roomID = context.Request.Params["roomID"];
            string sql = "select PName from TB_Person where RoomID = " + roomID + " order by DivisionID";

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
            else if (dt.Rows.Count == 0)
            {
                string sql1 = "select users from TB_Room where ID=" + roomID;
                DataTable dt1 = office.Query(sql1).Tables[0];
                if (dt1.Rows.Count > 0)
                {
                    foreach (DataRow row in dt1.Rows)
                    {
                        mRetSB.Append("{ ");
                        foreach (DataColumn column in dt1.Columns)
                        {
                            mRetSB.Append("\"" + column.ColumnName + "\":\"" + row[column.ColumnName].ToString() + "\",");
                        }
                        mRetSB.Remove(mRetSB.Length - 1, 1);
                        mRetSB.Append("},");
                    }
                }
            }

            mRetSB.Remove(mRetSB.Length - 1, 1);
            mRetSB.Append("]");
            context.Response.Write(mRetSB.ToString());
            context.Response.End();
        }
        #endregion

        #region 根据房间号获取房间内人员所在处室
        public void getRoomDivision(HttpContext context)
        {
            string roomID = context.Request.Params["roomID"];
            string sql = "select distinct TBD.ID, TBD.DivisionName from TB_Division as TBD left join TB_Person as TBP on TBP.DivisionID = TBD.ID where TBP.RoomID='" + roomID + "' order by TBD.ID";

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
        #region 政府办公楼办公人员职称分布情况
        public void personSpread(HttpContext context)
        {
            string buildingId = context.Request.Params["buildingId"];
            string houseSubID = context.Request.Params["houseSubID"];
            string floor = context.Request.Params["floor"];
            string divisionID = context.Request.Params["divisionID"];
            string state = context.Request.Params["state"];
            string PName = context.Request.Params["PName"];
            string scale = context.Request.Params["scale"];
            string TitleID = context.Request.Params["TitleID"];
            string roomType = context.Request.Params["roomType"];
            string sql = "select TBT.TitleName,Count(TBT.TitleName) as num,max(TBT.ID) as ID from TB_Person as TBP ";
            sql += "left join TB_Room as TBR on TBP.RoomID=TBR.ID ";
            sql += "left join (SELECT b.RoomID, SUM(c.Area) AS barea FROM  dbo.TB_Person AS b INNER JOIN dbo.TB_Title AS c ON b.TitleID = c.ID where b.state='1' and b.RoomID is not null and b.RoomID!='0' GROUP BY b.RoomID) as TBB on TBB.RoomID=TBP.RoomID ";
            sql += "left join TB_Title as TBT on TBT.ID=TBP.TitleID  where TBR.HouseID='" + buildingId + "' and state='1' ";

            if (houseSubID == "" || houseSubID == null)
            {

            }
            else
            {
                sql += "and TBR.HouseSubID='" + houseSubID + "' ";
            }
            if (floor == "" || floor == null)
            {

            }
            else
            {
                sql += "and TBR.FloorNo='" + floor + "' ";
            }
            if (divisionID == "" || divisionID == null)
            {

            }
            else
            {
                sql += "and TBP.DivisionID='" + divisionID + "' ";
            }
            if (PName == "" || PName == null)
            {

            }
            else
            {
                sql += "and TBP.PName like '%" + PName + "%' ";
            }

            if (state == null || state == "")
            {

            }
            else
            {
                switch (state)
                {
                    case "0":
                        sql += "and TBR.Area>" + scale + "*TBB.barea ";
                        break;
                    case "1":
                        sql += "and TBR.Area<=" + scale + "*TBB.barea ";
                        break;
                    case "2":
                        sql += "and TBB.barea is null ";
                        break;
                }
            }
            sql += "group by TBT.TitleName";

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
        #region 获取全景图片
        public void getPano(HttpContext context)
        {
            string RoomID = context.Request.Params["roomID"];
            string sql = "select ImgPath from TB_Image  where SID='" + RoomID + "' and Type=5";
            //string sql = "select imgPath from TB_Image  where  Type=5";
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

        #region 根据办公大楼介绍
        public void officeInfo(HttpContext context)
        {
            string ID = context.Request.Params["ID"];
            string sql = "select info from TB_House where ID='" + ID + "'";
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
        #region 根据房间号查询该房间人员信息;
        public void findRoomPerson(HttpContext context)
        {
            string ID = context.Request.Params["roomId"];
            string sql = "SELECT PName,TitleID,TitleName,TBD.DivisionName,a.RoomID FROM TB_Person as a  inner join TB_Title as c on a.TitleID=c.ID left join TB_Division as TBD on TBD.ID = a.DivisionID where a.RoomID='" + ID + "'";
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
        #region 获取图片路径(单位，大楼，办公室);
        public void getlunboImg(HttpContext context)
        {
            string Type = context.Request.Params["Type"];
            string SID = context.Request.Params["SID"];


            string sql = "select ImgPath from TB_Image where Type=" + Type + " and SID='" + SID + "'";

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
        #region 根据房间ID获取硬件设施;
        public void getHardWare(HttpContext context)
        {
            string RoomID = context.Request.Params["RoomID"];
            string sql = "SELECT HardName ,Number ,Manufactor,HState,Unit FROM TB_RHardware where RoomID='" + RoomID + "'";
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
        #region 获取选择框下一级数据(动态多级菜单);
        public void getNextData(HttpContext context)
        {
            string selectName = context.Request.Params["selectName"];
            string optionName = context.Request.Params["optionName"];
            string sql = "";
            switch (selectName)
            {
                case "0":
                    sql = "select ID,HouseName from TB_House where UnitId = '" + optionName + "'";
                    break;
                case "1":
                    sql = "select ID,HouseSUBName from TB_HouserSUB where HouseId = '" + optionName + "'";
                    break;
                case "2":
                    sql = "SELECT distinct FloorNo FROM TB_Room where HouseSUBID ='" + optionName + "'";
                    break;
                case "title":
                    sql = "select ID,TitleName from TB_Title ";
                    break;
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
        #region 搜索功能;
        public void searchData(HttpContext context)
        {
            //string type = context.Request.Params["type"];
            string typeNext = context.Request.Params["typeNext"];
            string unitID = context.Request.Params["unitID"];
            string buildingID = context.Request.Params["buildingID"];


            //sql指的是表格中的数据,sql1指的是职称分布数据
            string sql = "SELECT s.ID, s.FloorNo,y.info,x.Type, s.RoomName,s.BuildArea, s.Area, t.RoomID, t.barea,TBD.DivisionName,b.PName,TBH.HouseName,TBI.ImgPath FROM dbo.TB_Room AS s ";
            sql += "LEFT OUTER JOIN(SELECT b.RoomID, SUM(c.Area) AS barea FROM dbo.TB_Person AS b INNER JOIN dbo.TB_Title AS c ON b.TitleID = c.ID GROUP BY b.RoomID ) AS t ON s.ID = t.RoomID ";
            sql += "left join dbo.TB_RType as x on s.RoomType=x.ID ";
            sql += " left join TB_HouserSUB as y on s.HouseSUBID=y.ID ";
            sql += "left join TB_Person as b on s.ID=b.RoomID ";
            sql += " left join TB_Division as TBD on TBD.ID=b.DivisionID ";
            sql += "left join TB_Image as TBI on TBI.SID = s.ID ";
            sql += " left join TB_House as TBH on TBH.ID=s.HouseID ";
            string sql1 = "SELECT c.TitleName, Count(c.TitleName) as num,max(c.ID) as ID from (TB_Person as a left join  TB_Room as b on a.RoomID=b.ID left join TB_Title c on a.TitleID=c.ID )";
            if (buildingID == "")
            {
                sql += "where b.PName like '%" + typeNext + "%'";
                sql1 += " where  b.UnitID='" + unitID + "' and a.PName like '%" + typeNext + "%'";
            }
            else
            {
                sql += "where b.PName like '%" + typeNext + "%' and s.HouseID='" + buildingID + "'";
                sql1 += " where  b.UnitID='" + unitID + "' and a.PName like '%" + typeNext + "%' ";
                sql1 += "and b.HouseID='" + buildingID + "' ";
            }
            sql1 += "group by c.TitleName order by ID ";
            DataTable dt = office.Query(sql).Tables[0];
            DataTable dt1 = office.Query(sql1).Tables[0];
            StringBuilder mRetSB = new StringBuilder();
            mRetSB.Append("[ ");
            if (dt.Rows.Count > 0)
            {
                mRetSB.Append("{\"tableData\":[");
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
                mRetSB.Remove(mRetSB.Length - 1, 1);
                mRetSB.Append("],\"TitleData\":[");
            }

            if (dt1.Rows.Count > 0)
            {
                foreach (DataRow row in dt1.Rows)
                {
                    mRetSB.Append("{ ");
                    foreach (DataColumn column in dt1.Columns)
                    {
                        mRetSB.Append("\"" + column.ColumnName + "\":\"" + row[column.ColumnName].ToString() + "\",");
                    }
                    mRetSB.Remove(mRetSB.Length - 1, 1);
                    mRetSB.Append("},");
                }
                mRetSB.Remove(mRetSB.Length - 1, 1);
                mRetSB.Append("]},");
            }
            mRetSB.Remove(mRetSB.Length - 1, 1);
            mRetSB.Append("]");
            context.Response.Write(mRetSB.ToString());
            context.Response.End();
        }
        #endregion
        #region 搜索内容;
        public void searchContent(HttpContext context)
        {
            string buildingId = context.Request.Params["buildingId"];
            string sql = "";
            string sql1 = "";
            string sql2 = "";
            sql = "SELECT HouseSUBName,ID FROM TB_HouserSUB WHERE HouseID='" + buildingId + "'";
            sql1 = "SELECT distinct FloorNo FROM TB_Room WHERE HouseID='" + buildingId + "'";

            sql2 = "SELECT distinct c.ID ,c.DivisionName FROM TB_Room as a left join TB_Person as b on b.RoomID = a.ID left join TB_Division as c on c.ID=b.DivisionID where a.HouseID='" + buildingId + "' AND c.ID is not null";
            DataTable dt = office.Query(sql).Tables[0];
            DataTable dt1 = office.Query(sql1).Tables[0];
            DataTable dt2 = office.Query(sql2).Tables[0];
            StringBuilder mRetSB = new StringBuilder();
            mRetSB.Append("[ ");
            if (dt.Rows.Count > 0)
            {
                mRetSB.Append("{\"HouseSUBName\":[");
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
                mRetSB.Remove(mRetSB.Length - 1, 1);
                mRetSB.Append("],\"floorName\":[");
            }
            else if (dt.Rows.Count == 0)
            {
                mRetSB.Append("],\"floorName\":[");
            }
            if (dt1.Rows.Count > 0)
            {
                foreach (DataRow row in dt1.Rows)
                {
                    mRetSB.Append("{ ");
                    foreach (DataColumn column in dt1.Columns)
                    {
                        mRetSB.Append("\"" + column.ColumnName + "\":\"" + row[column.ColumnName].ToString() + "\",");
                    }
                    mRetSB.Remove(mRetSB.Length - 1, 1);
                    mRetSB.Append("},");
                }
                mRetSB.Remove(mRetSB.Length - 1, 1);
                mRetSB.Append("],\"divisionName\":[");
            }
            else if (dt1.Rows.Count == 0)
            {
                mRetSB.Append("],\"divisionName\":[");
            }
            if (dt2.Rows.Count > 0)
            {
                foreach (DataRow row in dt2.Rows)
                {
                    mRetSB.Append("{ ");
                    foreach (DataColumn column in dt2.Columns)
                    {
                        mRetSB.Append("\"" + column.ColumnName + "\":\"" + row[column.ColumnName].ToString() + "\",");
                    }
                    mRetSB.Remove(mRetSB.Length - 1, 1);
                    mRetSB.Append("},");
                }
                mRetSB.Remove(mRetSB.Length - 1, 1);
                mRetSB.Append("]},");
            }
            else if (dt2.Rows.Count == 0)
            {
                mRetSB.Append("]},");
            }
            mRetSB.Remove(mRetSB.Length - 1, 1);
            mRetSB.Append("]");
            context.Response.Write(mRetSB.ToString());
            context.Response.End();
        }
        #endregion
        #region 楼房内搜索信息
        public void houseSearch(HttpContext context)
        {
            string unitID = context.Request.Params["unitID"];
            string buildingId = context.Request.Params["buildingId"];
            string houseSUBID = context.Request.Params["houseSUBName"];
            string floorName = context.Request.Params["floorName"];
            string divisionID = context.Request.Params["divisionID"];
            string sql = "select distinct s.ID, s.FloorNo,y.info,x.Type, s.RoomName,s.BuildArea, s.Area,z.DivisionName, t.RoomID,t.barea,TBP.DivisionID,TBP.PName,TBH.HouseName,TBI.ImgPath FROM dbo.TB_Room AS s ";
            sql += "LEFT OUTER JOIN(SELECT b.RoomID, SUM(c.Area) AS barea FROM  dbo.TB_Person AS b INNER JOIN dbo.TB_Title AS c ON b.TitleID = c.ID GROUP BY b.RoomID ) AS t ON s.ID = t.RoomID ";
            sql += "left join dbo.TB_RType as x on s.RoomType=x.ID ";
            sql += "left join TB_HouserSUB as y on s.HouseSUBID=y.ID ";
            sql += "left join TB_Person as TBP on TBP.RoomID = s.ID ";
            sql += "left join TB_Division as z on z.ID = TBP.DivisionID ";
            sql += "left join TB_Image as TBI on TBI.SID = s.ID ";
            sql += "left join TB_House as TBH on TBH.ID=s.HouseID where s.UnitID='" + unitID + "'";
            string sql1 = "SELECT c.TitleName, Count(c.TitleName) as num,max(c.ID) as ID from (TB_Person as a left join  TB_Room as b on a.RoomID=b.ID left join TB_Title c on a.TitleID=c.ID ) ";
            sql1 += "where b.UnitID='" + unitID + "'";
            if (buildingId == "0")
            {
                sql += "";
                sql1 += "";
            }
            else
            {
                sql += "and s.HouseID='" + buildingId + "' ";
                sql1 += "and b.HouseID='" + buildingId + "' ";
            }
            if (houseSUBID == "0")
            {
                sql += "";
                sql1 += "";
            }
            else
            {
                sql += "and s.HouseSUBID='" + houseSUBID + "' ";
                sql1 += "and b.HouseSUBID='" + houseSUBID + "' ";
            }
            if (floorName == "0")
            {
                sql += "";
                sql1 += "";
            }
            else
            {
                sql += " and s.FloorNo='" + floorName + "'";
                sql1 += " and b.FloorNo='" + floorName + "'";
            }
            if (divisionID == "0")
            {
                sql += "";
                sql1 += "";
            }
            else
            {
                sql += " and TBP.DivisionID = '" + divisionID + "' ";
                sql1 += " and a.DivisionID = '" + divisionID + "'";
            }

            sql1 += "group by c.TitleName order by ID ";
            //if (divisionID == "0") { 
            //    if (houseSUBName == "0")
            //    {
            //        if (floorName == "0")
            //        {
            //            sql = "where   (z.DivisionName is not null or (z.DivisionName is null and t.barea is null)) and and s.UnitID='" + unitID + "'";
            //            sql1 = "where   b.HouseID='" + buildingId + "' and b.UnitID='" + unitID + "' group by c.TitleName order by ID";
            //        }
            //        else
            //        {
            //            sql = "SELECT distinct s.ID, s.FloorNo,y.info,x.Type, s.RoomName,s.BuildArea, s.Area,z.DivisionName, t.RoomID,t.barea,TBP.DivisionID,TBH.HouseName FROM dbo.TB_Room AS s LEFT OUTER JOIN(SELECT b.RoomID, SUM(c.Area) AS barea FROM  dbo.TB_Person AS b INNER JOIN dbo.TB_Title AS c ON b.TitleID = c.ID GROUP BY b.RoomID ) AS t ON s.ID = t.RoomID left join dbo.TB_RType as x on s.RoomType=x.ID left join TB_HouserSUB as y on s.HouseSUBID=y.ID LEFT join TB_Person as TBP on TBP.RoomID = s.ID left join TB_Division as z on z.ID = TBP.DivisionID left join TB_House as TBH on TBH.ID=s.HouseID where   (z.DivisionName is not null or (z.DivisionName is null and t.barea is null)) and s.HouseID='" + buildingId + "' and s.UnitID='" + unitID + "' and s.FloorNo='" + floorName + "'";
            //            sql1 = "SELECT c.TitleName, Count(c.TitleName) as num,max(c.ID) as ID from (TB_Person as a left join  TB_Room as b on a.RoomID=b.ID left join TB_Title c on a.TitleID=c.ID ) where b.HouseID='" + buildingId + "' and b.FloorNo='" + floorName + "' and b.UnitID='" + unitID + "' group by c.TitleName order by ID";
            //        }
            //    }
            //    else
            //    {
            //        if (floorName == "0")
            //        {
            //            sql = "SELECT distinct s.ID, s.FloorNo,y.info,x.Type, s.RoomName,s.BuildArea, s.Area,z.DivisionName, t.RoomID,t.barea,TBP.DivisionID,TBH.HouseName FROM dbo.TB_Room AS s LEFT OUTER JOIN(SELECT b.RoomID, SUM(c.Area) AS barea FROM  dbo.TB_Person AS b INNER JOIN dbo.TB_Title AS c ON b.TitleID = c.ID GROUP BY b.RoomID ) AS t ON s.ID = t.RoomID left join dbo.TB_RType as x on s.RoomType=x.ID left join TB_HouserSUB as y on s.HouseSUBID=y.ID LEFT join TB_Person as TBP on TBP.RoomID = s.ID left join TB_Division as z on z.ID = TBP.DivisionID left join TB_House as TBH on TBH.ID=s.HouseID where   (z.DivisionName is not null or (z.DivisionName is null and t.barea is null)) and s.HouseID='" + buildingId + "' and s.UnitID='" + unitID + "' and s.HouseSUBID='" + houseSUBName + "'";
            //            sql1 = "SELECT c.TitleName, Count(c.TitleName) as num,max(c.ID) as ID from (TB_Person as a left join  TB_Room as b on a.RoomID=b.ID left join TB_Title c on a.TitleID=c.ID ) where b.HouseID='" + buildingId + "' and b.HouseSUBID='" + houseSUBName + "' and b.UnitID='" + unitID + "' group by c.TitleName order by ID";
            //        }
            //        else
            //        {
            //            sql = "SELECT distinct s.ID, s.FloorNo,y.info,x.Type, s.RoomName,s.BuildArea, s.Area,z.DivisionName, t.RoomID,t.barea,TBP.DivisionID,TBH.HouseName FROM dbo.TB_Room AS s LEFT OUTER JOIN(SELECT b.RoomID, SUM(c.Area) AS barea FROM  dbo.TB_Person AS b INNER JOIN dbo.TB_Title AS c ON b.TitleID = c.ID GROUP BY b.RoomID ) AS t ON s.ID = t.RoomID left join dbo.TB_RType as x on s.RoomType=x.ID left join TB_HouserSUB as y on s.HouseSUBID=y.ID LEFT join TB_Person as TBP on TBP.RoomID = s.ID left join TB_Division as z on z.ID = TBP.DivisionID left join TB_House as TBH on TBH.ID=s.HouseID where   (z.DivisionName is not null or (z.DivisionName is null and t.barea is null)) and s.HouseID='" + buildingId + "' and s.UnitID='" + unitID + "' and s.HouseSUBID='" + houseSUBName + "' and s.FloorNo='" + floorName + "'";
            //            sql1 = "SELECT c.TitleName, Count(c.TitleName) as num,max(c.ID) as ID from (TB_Person as a left join  TB_Room as b on a.RoomID=b.ID left join TB_Title c on a.TitleID=c.ID ) where b.HouseID='" + buildingId + "' and b.HouseSUBID='" + houseSUBName + "' and b.FloorNo='" + floorName + "' and b.UnitID='" + unitID + "' group by c.TitleName order by ID";
            //        }
            //    }
            //}
            //else
            //{
            //    if (houseSUBName == "0")
            //    {
            //        if (floorName == "0")
            //        {
            //            sql = "SELECT distinct s.ID, s.FloorNo,y.info,x.Type, s.RoomName,s.BuildArea, s.Area,z.DivisionName, t.RoomID,t.barea,TBP.DivisionID,TBH.HouseName FROM dbo.TB_Room AS s LEFT OUTER JOIN(SELECT b.RoomID, SUM(c.Area) AS barea FROM  dbo.TB_Person AS b INNER JOIN dbo.TB_Title AS c ON b.TitleID = c.ID GROUP BY b.RoomID ) AS t ON s.ID = t.RoomID left join dbo.TB_RType as x on s.RoomType=x.ID left join TB_HouserSUB as y on s.HouseSUBID=y.ID LEFT join TB_Person as TBP on TBP.RoomID = s.ID left join TB_Division as z on z.ID = TBP.DivisionID left join TB_House as TBH on TBH.ID=s.HouseID where   (z.DivisionName is not null or (z.DivisionName is null and t.barea is null)) and s.HouseID='" + buildingId + "' and s.UnitID='" + unitID + "' and TBP.DivisionID = '" + divisionID + "'";
            //            sql1 = "SELECT c.TitleName, Count(c.TitleName) as num,max(c.ID) as ID from (TB_Person as a left join  TB_Room as b on a.RoomID=b.ID left join TB_Title c on a.TitleID=c.ID ) where b.HouseID='" + buildingId + "' and a.DivisionID = '" + divisionID + "' and b.UnitID='" + unitID + "' group by c.TitleName order by ID";
            //        }
            //        else
            //        {
            //            sql = "SELECT distinct s.ID, s.FloorNo,y.info,x.Type, s.RoomName,s.BuildArea, s.Area,z.DivisionName, t.RoomID,t.barea,TBP.DivisionID,TBH.HouseName FROM dbo.TB_Room AS s LEFT OUTER JOIN(SELECT b.RoomID, SUM(c.Area) AS barea FROM  dbo.TB_Person AS b INNER JOIN dbo.TB_Title AS c ON b.TitleID = c.ID GROUP BY b.RoomID ) AS t ON s.ID = t.RoomID left join dbo.TB_RType as x on s.RoomType=x.ID left join TB_HouserSUB as y on s.HouseSUBID=y.ID LEFT join TB_Person as TBP on TBP.RoomID = s.ID left join TB_Division as z on z.ID = TBP.DivisionID left join TB_House as TBH on TBH.ID=s.HouseID where   (z.DivisionName is not null or (z.DivisionName is null and t.barea is null)) and s.HouseID='" + buildingId + "' and s.UnitID='" + unitID + "' and s.FloorNo='" + floorName + "' and TBP.DivisionID = '" + divisionID + "'";
            //            sql1 = "SELECT c.TitleName, Count(c.TitleName) as num,max(c.ID) as ID from (TB_Person as a left join  TB_Room as b on a.RoomID=b.ID left join TB_Title c on a.TitleID=c.ID ) where b.HouseID='" + buildingId + "' and b.FloorNo='" + floorName + "' and a.DivisionID = '" + divisionID + "' and b.UnitID='" + unitID + "' group by c.TitleName order by ID";
            //        }
            //    }
            //    else
            //    {
            //        if (floorName == "0")
            //        {
            //            sql = "SELECT distinct s.ID, s.FloorNo,y.info,x.Type, s.RoomName,s.BuildArea, s.Area,z.DivisionName, t.RoomID,t.barea,TBP.DivisionID,TBH.HouseName FROM dbo.TB_Room AS s LEFT OUTER JOIN(SELECT b.RoomID, SUM(c.Area) AS barea FROM  dbo.TB_Person AS b INNER JOIN dbo.TB_Title AS c ON b.TitleID = c.ID GROUP BY b.RoomID ) AS t ON s.ID = t.RoomID left join dbo.TB_RType as x on s.RoomType=x.ID left join TB_HouserSUB as y on s.HouseSUBID=y.ID LEFT join TB_Person as TBP on TBP.RoomID = s.ID left join TB_Division as z on z.ID = TBP.DivisionID left join TB_House as TBH on TBH.ID=s.HouseID where   (z.DivisionName is not null or (z.DivisionName is null and t.barea is null)) and s.HouseID='" + buildingId + "' and s.UnitID='" + unitID + "' and s.HouseSUBID='" + houseSUBName + "' and TBP.DivisionID = '" + divisionID + "'";
            //            sql1 = "SELECT c.TitleName, Count(c.TitleName) as num,max(c.ID) as ID from (TB_Person as a left join  TB_Room as b on a.RoomID=b.ID left join TB_Title c on a.TitleID=c.ID ) where b.HouseID='" + buildingId + "' and b.HouseSUBID='" + houseSUBName + "' and a.DivisionID = '" + divisionID + "' and b.UnitID='" + unitID + "' group by c.TitleName order by ID";
            //        }
            //        else
            //        {
            //            sql = "SELECT distinct s.ID, s.FloorNo,y.info,x.Type, s.RoomName,s.BuildArea, s.Area,z.DivisionName, t.RoomID,t.barea,TBP.DivisionID,TBH.HouseName FROM dbo.TB_Room AS s LEFT OUTER JOIN(SELECT b.RoomID, SUM(c.Area) AS barea FROM  dbo.TB_Person AS b INNER JOIN dbo.TB_Title AS c ON b.TitleID = c.ID GROUP BY b.RoomID ) AS t ON s.ID = t.RoomID left join dbo.TB_RType as x on s.RoomType=x.ID left join TB_HouserSUB as y on s.HouseSUBID=y.ID LEFT join TB_Person as TBP on TBP.RoomID = s.ID left join TB_Division as z on z.ID = TBP.DivisionID left join TB_House as TBH on TBH.ID=s.HouseID where   (z.DivisionName is not null or (z.DivisionName is null and t.barea is null)) and s.HouseID='" + buildingId + "' and s.UnitID='" + unitID + "' and s.HouseSUBID='" + houseSUBName + "' and s.FloorNo='" + floorName + "' and TBP.DivisionID = '" + divisionID + "'";
            //            sql1 = "SELECT c.TitleName, Count(c.TitleName) as num,max(c.ID) as ID from (TB_Person as a left join  TB_Room as b on a.RoomID=b.ID left join TB_Title c on a.TitleID=c.ID ) where b.HouseID='" + buildingId + "' and b.HouseSUBID='" + houseSUBName + "' and b.FloorNo='" + floorName + "' and a.DivisionID = '" + divisionID + "' and b.UnitID='" + unitID + "' group by c.TitleName order by ID";
            //        }
            //    }
            //}


            DataTable dt = office.Query(sql).Tables[0];
            DataTable dt1 = office.Query(sql1).Tables[0];
            StringBuilder mRetSB = new StringBuilder();
            mRetSB.Append("[ ");
            if (dt.Rows.Count > 0)
            {
                mRetSB.Append("{\"tableData\":[");
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
                mRetSB.Remove(mRetSB.Length - 1, 1);
                mRetSB.Append("],\"TitleData\":[");
            }
            else if (dt.Rows.Count == 0)
            {
                mRetSB.Append("]");
                context.Response.Write(mRetSB.ToString());
                context.Response.End();
                return;
            }

            if (dt1.Rows.Count > 0)
            {
                foreach (DataRow row in dt1.Rows)
                {
                    mRetSB.Append("{ ");
                    foreach (DataColumn column in dt1.Columns)
                    {
                        mRetSB.Append("\"" + column.ColumnName + "\":\"" + row[column.ColumnName].ToString() + "\",");
                    }
                    mRetSB.Remove(mRetSB.Length - 1, 1);
                    mRetSB.Append("},");
                }
                mRetSB.Remove(mRetSB.Length - 1, 1);
                mRetSB.Append("]},");
            }
            else if (dt1.Rows.Count == 0)
            {
                mRetSB.Append("]},");
            }
            mRetSB.Remove(mRetSB.Length - 1, 1);
            mRetSB.Append("]");
            context.Response.Write(mRetSB.ToString());
            context.Response.End();
        }
        #endregion
        #region 导出处室/办公室信息到excel;
        public void getExcelData(HttpContext context)
        {
            string type = context.Request.Params["type"];
            string unitID = context.Request.Params["unitID"];
            string sql = "";

            if (type == "0")
            {
                sql += "select distinct TBU.UnitName,TBH.HouseName,TBHR.HouseSUBName,TBD.DivisionName,TBR.RoomName,TBR.Area,TBP.PName,TBT.TitleName from TB_Division as TBD ";
                sql += "left join TB_Person as TBP on TBD.ID=TBP.DivisionID ";
                sql += "left join TB_Title as TBT on TBT.ID=TBP.TitleID ";
                sql += "left join TB_Room as TBR on TBR.ID=TBP.RoomID ";
                sql += "left join TB_Unit as TBU on TBU.ID=TBR.UnitID ";
                sql += "left join TB_House as TBH on TBH.ID=TBR.HouseID ";
                sql += "left join TB_HouserSUB as TBHR on TBHR.ID=TBR.HouseSUBID where TBP.PName is not null";
                sql += " and TBR.UnitID='" + unitID + "'";
            }
            else if (type == "1")
            {
                sql += "select distinct TBU.UnitName,TBH.HouseName,TBHR.HouseSUBName,TBR.RoomName,TBR.Area,TBP.PName,TBT.TitleName,TBD.DivisionName From TB_Room as TBR ";
                sql += "left join TB_Person as TBP on TBP.RoomID=TBR.ID ";
                sql += "left join TB_Title as TBT on TBP.TitleID=TBT.ID ";
                sql += "left join TB_Division as TBD on TBP.DivisionID=TBD.ID ";
                sql += "left join TB_Unit as TBU on TBU.ID=TBR.UnitID ";
                sql += "left join TB_House as TBH on TBH.ID=TBR.HouseID ";
                sql += "left join TB_HouserSUB as TBHR on TBHR.ID=TBR.HouseSUBID where TBP.PName is not null";
                sql += " and TBR.UnitID='" + unitID + "'";
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
        #region 获取附属用房面积;
        public void getDependentsArea(HttpContext context)
        {
            string unitID = context.Request.Params["unitID"];
            string houseType = context.Request.Params["type"];
            string sql = "";
            sql += "select HouseName as name ,area as y from TB_House where type='" + houseType + "' and unitID='" + unitID + "'";

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
        #region 获取不同房间类型下的房间总面积;
        public void getRTypeArea(HttpContext context)
        {
            string unitID = context.Request.Params["unitID"];
            string areaType = context.Request.Params["areaType"];//areaType 1表示已用面积;0表示空置面积
            string sql = "";
            sql += "SELECT TBRT.ID as RoomType,TBRT.Type AS name,ISNULL(SUM(TBR.Area),0) as y from TB_Room as TBR left join (SELECT b.RoomID, SUM(c.Area) AS barea FROM  dbo.TB_Person AS b INNER JOIN dbo.TB_Title AS c ON b.TitleID = c.ID where b.state='1' and b.RoomID is not null and b.RoomID!='0' GROUP BY b.RoomID) as TBB on TBR.ID=TBB.RoomID left join TB_RType TBRT ON TBRT.ID=TBR.RoomType where TBR.UnitID='" + unitID + "' ";
            if (areaType == "0")
            {
                sql += "and TBB.barea is null GROUP BY TBRT.ID,TBRT.Type ";
            }
            else
            {
                sql += "and TBB.barea is not null GROUP BY TBRT.ID,TBRT.Type ";
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
        #region 获取当前房间类型下的办公楼总面积;
        public void getTheRTypeArea(HttpContext context)
        {
            string unitID = context.Request.Params["unitID"];
            string RoomType = context.Request.Params["RoomType"];
            string areaType = context.Request.Params["areaType"];
            string buildingID = context.Request.Params["buildingID"];
            string sql = "";
            sql += "select TBR.RoomType, TBH.HouseName as name,SUM(TBR.Area) as y from TB_Room as TBR ";
            sql += "left join (SELECT b.RoomID, SUM(c.Area) AS barea FROM  dbo.TB_Person AS b INNER JOIN dbo.TB_Title AS c ON b.TitleID = c.ID where b.state='1' and b.RoomID is not null and b.RoomID!='0' GROUP BY b.RoomID) as TBB on TBR.ID=TBB.RoomID left join TB_RType TBRT ON TBRT.ID=TBR.RoomType left join TB_House TBH on TBH.ID=TBR.HouseID where TBR.UnitID='" + unitID + "' and RoomType='" + RoomType + "' ";
            if (areaType == "0")
            {
                sql += "and TBB.barea is null ";
            }
            else
            {
                sql += "and TBB.barea is not null ";
            }
            if (buildingID == "" || buildingID == null)
            {

            }
            else
            {
                sql += "and TBR.HouseID='" + buildingID + "' ";
            }
            sql += "GROUP BY TBRT.ID,TBH.HouseName,TBR.RoomType ";
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
        #region 获取当前单位下的大楼名称;
        public void getBuildingName(HttpContext context)
        {
            string unitID = context.Request.Params["unitID"];

            string sql = "select HouseName as name,ID as className from TB_House where UnitID='" + unitID + "'";
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