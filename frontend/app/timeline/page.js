import Body from "@/components/layout/Body";
import TableTimeline from "@/components/TableTimeline";
import { fetchTimelineData } from "@/lib/data";

export default async function timeline() {
  const columns = [
    { name: "ID", uid: "id" },
    { name: "IMAGE", uid: "img_blob" },
    { name: "BATCH", uid: "batch" },
    { name: "AGE ON CAPTURE", uid: "age" },
    { name: "DATE", uid: "datestamp" },
    { name: "TIME", uid: "timestamp" },
    { name: "COUNT DATA", uid: "count_data" },
    { name: "EXPECTED MEGALOPA DATE", uid: "megalopa_datestamp" },
    { name: "CAPTURED BY", uid: "captured_by" },
  ];

  const timeline_data = await fetchTimelineData();

  return (
    <>
      <div>
        <TableTimeline columns={columns} timeline_data={timeline_data} />
      </div>
    </>
  );
}
