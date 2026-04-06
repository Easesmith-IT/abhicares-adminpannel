import { useEffect, useState } from "react";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import useGetApiReq from "../../../hooks/useGetApiReq";
import { useNavigate } from "react-router-dom";
import { Actions } from "../../shared/actions";
import { PaginationComp } from "../../shared/PaginationComp";

const AnnouncementList = () => {
  const { res, isLoading, fetchData } = useGetApiReq();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const [announcements, setAnnouncements] = useState([]);
  const onEdit = (item) => {
    navigate("/admin/banner/update-announcement", {
      state: { data: item },
    });
  };

  /**
   * 🔥 Fetch all announcements
   */
  useEffect(() => {
    fetchData("/banners/get-announcements", {
      screenName: "AnnouncementList",
    });
  }, []);

  /**
   * 🔥 Set data when response comes
   */
  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      console.log("res", res);

      setAnnouncements(res.data.data);
      setPageCount(res.data?.totalPages || 1);
    }
  }, [res]);

  return (
      <div className="table-container">

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>City</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>CTA</TableHead>
                {/* <TableHead>Colors</TableHead> */}
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {announcements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No announcements found
                  </TableCell>
                </TableRow>
              ) : (
                announcements.map((item) => (
                  <TableRow key={item._id}>
                    {/* City */}
                    <TableCell className="capitalize">{item.cityId?.name || "-"}</TableCell>

                    {/* Title */}
                    <TableCell className="font-medium">{item.title}</TableCell>

                    {/* CTA */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{item.ctaText}</span>
                        <span>Link: {item.ctaLink}</span>
                      </div>
                    </TableCell>

                    {/* Colors */}
                    {/* <TableCell>
                      <div className="flex gap-2">
                        <div
                          className="w-5 h-5 rounded border"
                          style={{ backgroundColor: item.bgColor }}
                        />
                        <div
                          className="w-5 h-5 rounded border"
                          style={{ backgroundColor: item.textColor }}
                        />
                      </div>
                    </TableCell> */}

                    {/* Status */}
                    <TableCell>
                      <Badge variant={item.isActive ? "success" : "secondary"}>
                        {item.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right">
                      {/* <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(item)}
                      >
                        Update
                      </Button> */}
                      <Actions onEdit={() => onEdit(item)} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        <PaginationComp
                    page={page}
                    pageCount={pageCount}
                    setPage={setPage}
                    className="mt-8 mb-5"
                  />
      </div>
  );
};

export default AnnouncementList;
