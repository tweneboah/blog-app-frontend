import { Link } from "react-router-dom";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid";
import Moment from "react-moment";
import { deleteCommentAction } from "../../redux/slices/comments/commentSlices";
import { useDispatch, useSelector } from "react-redux";

export default function CommentsList({ comments }) {
  const user = useSelector(state => state?.users);
  const { userAuth } = user;
  const isLoginuser = userAuth?._id;
  console.log(comments);
  //dispatch
  const dispatch = useDispatch();
  return (
    <div>
      <ul className="divide-y bg-gray-700 w-96 divide-gray-200 p-3 mt-5">
        <div className="text-gray-400">{comments?.length} Comments</div>
        <>
          {comments?.length <= 0 ? (
            <h1 className="text-yellow-400 text-lg text-center">No comments</h1>
          ) : (
            comments?.map(comment => (
              <>
                <li key={comment?._id} className="py-4  w-full">
                  <div className="flex space-x-3">
                    <img
                      className="h-6 w-6 rounded-full"
                      src={comment?.user?.profilePhoto}
                      alt=""
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <Link to={`/profile/${comment?.user?._id}`}>
                          <h3 className="text-sm font-medium text-green-400">
                            {comment?.user?.firstName} {comment?.user?.lastName}
                          </h3>
                        </Link>

                        <p className="text-bold text-yellow-500 text-base ml-5">
                          {/* <Moment fromNow ago>
                      {comment?.createdAt}
                    </Moment> */}

                          <Moment fromNow ago>
                            {comment?.createdAt}
                          </Moment>
                        </p>
                      </div>
                      <p className="text-sm text-gray-400">
                        {comment?.description}
                      </p>
                      {/* Check if is the same user created this comment */}

                      {isLoginuser === comment?.user?._id ? (
                        <p class="flex">
                          <Link
                            to={`/update-comment/${comment?._id}`}
                            class="p-3"
                          >
                            <PencilAltIcon class="h-5 mt-3 text-yellow-300" />
                          </Link>
                          <button
                            onClick={() =>
                              dispatch(deleteCommentAction(comment?._id))
                            }
                            class="ml-3"
                          >
                            <TrashIcon class="h-5 mt-3 text-red-600" />
                          </button>
                        </p>
                      ) : null}
                    </div>
                  </div>
                </li>
              </>
            ))
          )}
        </>
      </ul>
    </div>
  );
}
