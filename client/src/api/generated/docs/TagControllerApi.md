# TagControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**addTagToVideo**](TagControllerApi.md#addtagtovideo) | **POST** /api/videos/{videoId}/tags |  |
| [**list1**](TagControllerApi.md#list1) | **GET** /api/tags |  |
| [**listByVideo**](TagControllerApi.md#listbyvideo) | **GET** /api/videos/{videoId}/tags |  |
| [**removeTagFromVideo**](TagControllerApi.md#removetagfromvideo) | **DELETE** /api/videos/{videoId}/tags/{tagId} |  |



## addTagToVideo

> TagResponse addTagToVideo(videoId, tagCreateRequest)



### Example

```ts
import {
  Configuration,
  TagControllerApi,
} from '';
import type { AddTagToVideoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new TagControllerApi();

  const body = {
    // number
    videoId: 789,
    // TagCreateRequest
    tagCreateRequest: ...,
  } satisfies AddTagToVideoRequest;

  try {
    const data = await api.addTagToVideo(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **videoId** | `number` |  | [Defaults to `undefined`] |
| **tagCreateRequest** | [TagCreateRequest](TagCreateRequest.md) |  | |

### Return type

[**TagResponse**](TagResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## list1

> Array&lt;TagResponse&gt; list1()



### Example

```ts
import {
  Configuration,
  TagControllerApi,
} from '';
import type { List1Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new TagControllerApi();

  try {
    const data = await api.list1();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;TagResponse&gt;**](TagResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listByVideo

> Array&lt;TagResponse&gt; listByVideo(videoId)



### Example

```ts
import {
  Configuration,
  TagControllerApi,
} from '';
import type { ListByVideoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new TagControllerApi();

  const body = {
    // number
    videoId: 789,
  } satisfies ListByVideoRequest;

  try {
    const data = await api.listByVideo(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **videoId** | `number` |  | [Defaults to `undefined`] |

### Return type

[**Array&lt;TagResponse&gt;**](TagResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## removeTagFromVideo

> removeTagFromVideo(videoId, tagId)



### Example

```ts
import {
  Configuration,
  TagControllerApi,
} from '';
import type { RemoveTagFromVideoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new TagControllerApi();

  const body = {
    // number
    videoId: 789,
    // number
    tagId: 789,
  } satisfies RemoveTagFromVideoRequest;

  try {
    const data = await api.removeTagFromVideo(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **videoId** | `number` |  | [Defaults to `undefined`] |
| **tagId** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | No Content |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

