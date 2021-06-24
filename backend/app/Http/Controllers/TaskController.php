<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;


class TaskController extends Controller
{
    public function list()
    {
        $tasksList = Task::all();
        return response()->json($tasksList->load('category'), Response::HTTP_OK);
    }

    public function add(Request $request)
    {
        $task = new Task();

        $this->validate( $request, [
            "title" => "required|min:3|max:128|unique:tasks",
            "completion" => "numeric|integer|min:0|max:100",
            "status" => "numeric|integer|min:1|max:2",
            "categoryId" => "required|numeric|exists:categories,id"
        ]);

        $task->title = $request->input('title');
        $task->completion = $request->input('completion', 0);
        $task->status = $request->input('status', 1);
        $task->category_id = $request->input('categoryId');

        $task->save();

        if ($task->save()) {

            return response()->json($task->load('category'), Response::HTTP_CREATED);
        }

        return Response::HTTP_INTERNAL_SERVER_ERROR;
    }

    public function item($id)
    {
        $task = Task::find($id);

        if ($task !== null) {

            return response()->json($task, Response::HTTP_OK);
        }

        return response( "", Response::HTTP_NOT_FOUND );
    }

    public function edit($id, Request $request)
    {
        $task = Task::find($id);

        if ($task !== null) {

            if ($request->isMethod( "patch" )) {

                $oneDataAtLeast = false;

                // Pour chaque propriété, on vérifie si une modif est présente dans Request
                if( $request->filled('title'))
                {
                  $task->title = $request->input('title');
                  $oneDataAtLeast = true;
                }

                if( $request->filled('categoryId') )
                {
                  $task->category_id = $request->input('categoryId');
                  $oneDataAtLeast = true;
                }

                if( $request->filled('completion') )
                {
                  $task->completion = $request->input('completion');
                  $oneDataAtLeast = true;
                }

                if( $request->filled('status') )
                {
                  $task->status = $request->input('status');
                  $oneDataAtLeast = true;
                }

                if ($oneDataAtLeast == true) {

                    $task->save();

                    if ($task->save()) {

                        return response()->json($task, Response::HTTP_OK);

                    } else {

                        return response( "", Response::HTTP_INTERNAL_SERVER_ERROR);
                    }
                }

            } else {

                if ($request->filled([ "title", "categoryId", "completion", "status" ])) {

                    $task->title = $request->input('title');
                    $task->completion = $request->input('completion');
                    $task->status = $request->input('status');
                    $task->category_Id = $request->input('categoryId');

                    $task->save();

                    if ($task->save()) {

                        return response()->json($task, Response::HTTP_OK);

                    } else {

                        return response( "", Response::HTTP_INTERNAL_SERVER_ERROR);
                    }

                } else {

                    return response( "", Response::HTTP_BAD_REQUEST);
                }
            }
        }

        return response( "", Response::HTTP_NOT_FOUND );
    }

    public function delete($id)
    {
        // https://laravel.com/docs/6.x/eloquent#deleting-models

        $task = Task::find($id);

        if ($task !== null) {

            $task->delete();

            if ($task->delete() === null) {

                return Response::HTTP_NO_CONTENT;

            }
                return Response::HTTP_INTERNAL_SERVER_ERROR;
        }

        return Response::HTTP_NOT_FOUND;
    }
}
