import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
  Input,
  Button,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { authorsTableData, projectsTableData } from "@/data";
import { Link } from "react-router-dom";
import { MessageCard } from "@/widgets/cards";
import axios from 'axios';
import { useRef, useState } from "react";
import { useEffect } from "react";

export function Tables() {
  const [validate, setvalidate] = useState(false)
  const refSubject = useRef(null)
  const contentRef = useRef(null)
  const [value, setvalue] = useState("");
  const [Article, setArticle] = useState(null);

  const Token = localStorage.getItem('token')
  console.log("Token",Token)

  useEffect(() => {
    console.log("okkkk")
    async function fetchData() {
      try {
        const allArticles = await axios.post('http://localhost:3000/article/getArticle', { token: Token })
        console.log(allArticles.data.articles)
        setArticle(allArticles.data.articles)
      } catch (error) {
        console.log(error);
      }
    }
    fetchData()
    console.log(Article)
  }, [validate]);

  const generateArticle = async () => {
    try {
      var subject = refSubject.current.getElementsByTagName('input')[0].value
      console.log(subject)
      const content = await axios.post('http://localhost:3000/article/generateArticle', { subject: subject })
      contentRef.current.innerHTML = content.data.articles
      setvalue(content.data.articles)
    } catch (error) {
      console.log(error);
    }
  }

  const addArticle = async () => {
    try {
      let subject = refSubject.current.getElementsByTagName('input')[0].value
      console.log("subject",subject)
      console.log("value",value)
      console.log("token",Token)
      const result = await axios.post('http://localhost:3000/article/addArticle', { subject: subject, content: value, token: Token })
      console.log(result)
      setvalidate(!validate)
      refSubject.current.getElementsByTagName('input')[0].value = ""
      contentRef.current.innerHTML = ""
    } catch (error) {
      console.log(error);
    }
  }

  const deleteArticle = async (id) => {
    try {
      console.log("from delete")
      console.log(id)
      const deleteResult = await axios.post('http://localhost:3000/article/deleteArticle', { id: id })
      console.log(deleteResult)
      setvalidate(!validate)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Add New Article
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-6 pt-0 pb-2">
          <Typography variant="h5" color="blue-gray" className="mb-1">
            Enter the subject
          </Typography>
          <Typography className="text-xs font-normal text-blue-gray-500">
            let me know what subject you would like me to assist you with.
          </Typography>
          <div className="mr-auto my-6 flex flex-row justify-center items-center">
            <Input label="Type here" ref={refSubject} />
            <Link className="ml-2" >
              <Button variant="outlined" size="sm" onClick={() => { generateArticle() }}>
                Search
              </Button>
            </Link>
          </div>
          <div className="w-full border h-52 rounded-md overflow-y-scroll">
            <p ref={contentRef} className="p-3" ></p>
          </div>
          <div className="flex flex-row justify-end items-center">
            <Link className="mr-1 mt-3" onClick={() => { contentRef.current.innerHTML = ""; generateArticle() }}>
              <div className="icons8-refresh mr-4"></div>
            </Link>
            <Link className="mt-2">
              <Button variant="outlined" size="sm" onClick={() => { contentRef.current.innerHTML = ""; addArticle() }}>
                Validate
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Articles Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["subject", "content", "status", "date", ""].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            {Article != null &&
              <tbody>
                {Article.map(
                  ({ id, subject, content, status, createdAt }, key) => {
                    const className = `py-3 px-5 ${key === Article.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                      }`;

                    return (
                      <tr key={id}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                              >
                                {subject}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-normal text-blue-gray-500 h-10 w-96 flex items-center truncate" >
                            {content}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Chip
                            variant="gradient"
                            color={(status == 1) ? "green" : "blue-gray"}
                            value={(status == 1) ? "converted" : "non-converted"}
                            className="py-0.5 px-2 text-[11px] font-medium"
                          />
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {createdAt}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Button variant="text" size="sm" onClick={() => { deleteArticle(id) }}>
                            delete
                          </Button>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>}
          </table>
        </CardBody>
      </Card>
      {/* <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Projects Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["companies", "members", "budget", "completion", ""].map(
                  (el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {projectsTableData.map(
                ({ img, name, members, budget, completion }, key) => {
                  const className = `py-3 px-5 ${
                    key === projectsTableData.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={name}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Avatar src={img} alt={name} size="sm" />
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold"
                          >
                            {name}
                          </Typography>
                        </div>
                      </td>
                      <td className={className}>
                        {members.map(({ img, name }, key) => (
                          <Tooltip key={name} content={name}>
                            <Avatar
                              src={img}
                              alt={name}
                              size="xs"
                              variant="circular"
                              className={`cursor-pointer border-2 border-white ${
                                key === 0 ? "" : "-ml-2.5"
                              }`}
                            />
                          </Tooltip>
                        ))}
                      </td>
                      <td className={className}>
                        <Typography
                          variant="small"
                          className="text-xs font-medium text-blue-gray-600"
                        >
                          {budget}
                        </Typography>
                      </td>
                      <td className={className}>
                        <div className="w-10/12">
                          <Typography
                            variant="small"
                            className="mb-1 block text-xs font-medium text-blue-gray-600"
                          >
                            {completion}%
                          </Typography>
                          <Progress
                            value={completion}
                            variant="gradient"
                            color={completion === 100 ? "green" : "blue"}
                            className="h-1"
                          />
                        </div>
                      </td>
                      <td className={className}>
                        <Typography
                          as="a"
                          href="#"
                          className="text-xs font-semibold text-blue-gray-600"
                        >
                          <EllipsisVerticalIcon
                            strokeWidth={2}
                            className="h-5 w-5 text-inherit"
                          />
                        </Typography>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card> */}
    </div>
  );
}

export default Tables;
