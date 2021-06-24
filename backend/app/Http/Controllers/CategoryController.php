<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;


class CategoryController extends Controller
{

    public function list()
    {
        $categoriesList = Category::all();
        return response()->json($categoriesList->load('tasks'), Response::HTTP_OK);
    }

    public function add(Request $request)
    {
        $category = new Category();

        $category->name = $request->input('name');
        $category->status = $request->input('status');

        $category->save();

        if ($category->save()) {

            return response()->json($category, Response::HTTP_OK);
        }

        return Response::HTTP_INTERNAL_SERVER_ERROR;
    }

    public function item($id)
    {
        $category = Category::find($id);

        if (!empty($category)) {

            return response()->json($category, Response::HTTP_OK);
        } else {

            abort(404);
        }
    }

    public function edit($id, Request $request)
    {
        $category = Category::find($id);

        if (!empty($category)) {

            if ($_SERVER['REQUEST_METHOD'] === "PATCH") {
                if ($request->has('name')) {
                    $category->name = $request->input('name');
                    $category->save();
                }

                if ($request->has('status')) {
                    $category->status = $request->input('status');
                    $category->save();
                }
            } else {
                if ($request->has('name') && $request->has('status')) {
                    $category->name = $request->input('name');
                    $category->status = $request->input('status');

                    $category->save();

                    if ($category->save()) {
                        return response()->json($category, Response::HTTP_OK);
                    } else {
                        return Response::HTTP_INTERNAL_SERVER_ERROR;
                    }
                } else {
                    return Response::HTTP_BAD_REQUEST;
                }
            }
        } else {

            abort(404);
        }
    }

    public function delete($id)
    {
        // https://laravel.com/docs/6.x/eloquent#deleting-models

        Category::destroy($id);

        return response()->json([], Response::HTTP_NO_CONTENT);
    }
}
